<?php

namespace CampaignBundle;

use Lib\Helper;
use Lib\PDO;
use Lib\Redis;
use Core\Router;
use Core\Request;

class CoachXmasLib 
{
    const CACHE_KEY = 'topten';
    const FLOOD_KEY = 'flood:';
    const LOCK_USER_KEY = 'block:';
    const GAME_START_KEY = 'gamestart:';

    public function __construct() {
        $this->_pdo = PDO::getInstance();
        $this->helper = new Helper();
        $this->redis = Redis::getInstance();
    }

    public function getTopten()
    {
        if(OPEN_CACHE) {
            if($this->redis->get(self::CACHE_KEY)) {
                $topten = json_decode($this->redis->get(self::CACHE_KEY), 1);
                return $topten;
            }
            $topten = $this->findToptenRecord();
            $this->redis->set(self::CACHE_KEY, json_encode($topten, 1));
            $this->redis->setTimeout(self::CACHE_KEY, CACHE_TIME);
            return $topten;
        }
        $topten = $this->findToptenRecord();
        return $topten;
    }

    # 格式化成绩
    public function recordsFormat($records)
    {
        if($records) {
            $records= sprintf('% .2f', $records);
            $times = explode('.', $records);
            $minute = (int) ($times[0] / 60);   
            $second = $times[0] % 60;
            return "{$minute}分{$second}秒{$times[1]}";
        } else {
            return "0分0秒0";
        }
    }

    public function findToptenRecord()
    {
        $sql = "SELECT u.`nickname`, r.`records` FROM `user` u, `record` r WHERE u.`uid` = r.`uid` ORDER BY r.`records` ASC LIMIT 0, 10";
        $query = $this->_pdo->prepare($sql);
        $query->execute();
        $row = $query->fetchAll(\PDO::FETCH_ASSOC);
        if($row) {
            foreach ($row as $k => $v) {
                $row[$k]['records'] = $this->recordsFormat($v['records']);
            }
            return $row;
        }
        return false;
    }

    public function setFloodLock($uid)
    {
        // lock 5s 5s中提交一次成绩
        $floodkey = self::FLOOD_KEY . $uid;
        $this->redis->set($floodkey, 1);
        $this->redis->setTimeout($floodkey, 5);
    }

    public function getFloodLock($uid)
    {
        $floodkey = self::FLOOD_KEY . $uid;
        return $this->redis->get($floodkey);
    }

    public function unsetFloodLock($uid)
    {
        $floodkey = self::FLOOD_KEY . $uid;
        $this->redis->delete($floodkey);
    }

    /**
     * 游戏成绩
     */ 
    public function saveRecord($recordInfo)
    {
        global $user;

    	$playInfo = $this->findRecordByUid($recordInfo->uid);
        if(empty($playInfo)) {
            $isPlay = 0;
        } else {
            $isPlay = 1;
        }

        if((float)$recordInfo->records < (float)$playInfo['records']){
            $isMax = 1;
        } else {
            $isMax = 0;
        }

    	// $isMax = $this->findMaxRecord($recordInfo);
    	$result = array();
        
        $floodkey = 'flood:' . $user->uid;
        $gameid = isset($playInfo['id']) ? $playInfo['id'] : 0;
        $router= new Router();
        $share_url = $router->generateUrl('share/' . $gameid, array(), true);

    	//1.[1,1]刷新成绩 2.[1,0] or [0,1]重复未刷新成绩 3.[0,0]第一次玩游戏
    	$recordStatus = (int)$isPlay + (int)$isMax;

    	switch ($recordStatus) {
    		case 0:
    			$rs = $this->insertRecord($recordInfo);
    			if($rs) {
    				$result = array('status' => 1, 'msg' => '成绩保存成功！', 'share_url' => $share_url);
    			} else {
    				$result = array('status' => 0, 'msg' => '成绩保存失败！', 'share_url' => $share_url);
    			}
    			break;
    		case 1:
				$result = array('status' => 3, 'msg' => '很遗憾！您未刷新成绩！', 'share_url' => $share_url);
    			break;
			case 2:
    			$rs = $this->updateRecord($recordInfo);
    			if($rs) {
    				$result = array('status' => 1, 'msg' => '成绩保存成功！', 'share_url' => $share_url);
    			} else {
    				$result = array('status' => 0, 'msg' => '成绩保存失败！', 'share_url' => $share_url);
    			}
    			break;	
    		default:
    			break;
    	}
        $this->redis->delete($floodkey);
    	return $result;
    }

    public function findUserRecordNum($records)
    {
        $sql = "SELECT COUNT(id) AS `sum` FROM `record` WHERE `records` < :records";
        $query = $this->_pdo->prepare($sql);
        $query->execute(array(':records' => $records));
        $row = $query->fetchAll(\PDO::FETCH_ASSOC);
        if($row) {
            return $row[0]['sum'];
        }
        return false;
    }

    public function findMaxRecord($recordInfo)
    {
    	$sql = "SELECT COUNT(id) AS sum FROM `record` WHERE `uid` = :uid AND `records` < :records";
        $query = $this->_pdo->prepare($sql);
        $query->execute(array(':uid' => $recordInfo->uid, ':records' => $recordInfo->records));
        $row = $query->fetch(\PDO::FETCH_ASSOC);
        if($row) {
            return $row['sum'];
        }
        return false;
    }

    public function insertRecord($recordInfo)
    {
        $recordInfo->created = date('Y-m-d H:i:s');
        $recordInfo->updated = date('Y-m-d H:i:s');
        $recordInfo = (array) $recordInfo;
        $id = $this->helper->insertTable('record', $recordInfo);
        if($id) {
            return $id;
        }
        return false;
    }

    public function updateRecord($recordInfo)
    {
        $condition = array(
            array('uid', $recordInfo->uid, '='),
        );
        $info = new \stdClass();
        $info->records = $recordInfo->records;
        $info->timeinit = $recordInfo->timeinit;
        $info->updated = date('Y-m-d H:i:s');
        return $this->helper->updateTable('record', $info, $condition);
    }

    public function findRecordByUid($uid)
    {
        $sql = "SELECT `id`, `records` FROM `record` WHERE `uid` = :uid";
        $query = $this->_pdo->prepare($sql);
        $query->execute(array(':uid' => $uid));
        $row = $query->fetch(\PDO::FETCH_ASSOC);
        if($row) {
            return $row;
        }
        return false;
    }

    /**
     * 游戏开始 
     */
    public function gameStart()
    {
        if(SAFE_LOCK) { 
            $this->setGameStartTime();
        }
    }

    /**
     * 设置API安全key值
     * 1.生成安全key值写到客户端cookie里
     * 2.安全key值 + 登陆用户uid 写到服务端redis中，记录游戏的开始时间。
     */
    public function setGameStartTime()
    {
        global $user;
        $startKey = self::GAME_START_KEY . $user->uid;
        $this->redis->set($startKey, time());
        $this->redis->setTimeout($startKey, 300);
    }

    public function getGameStartTime()
    {
        global $user;
        $startKey = self::GAME_START_KEY . $user->uid;
        $startTime = $this->redis->get($startKey) ? $this->redis->get($startKey) : 0;
        return $startTime;
    }

    public function delGameStartTime()
    {
        global $user;
        $startKey = self::GAME_START_KEY . $user->uid;
        $this->redis->delete($startKey);
    }

    /**
     * API 安全处理
     */
    public function checkSafe($recordInfo)
    {
        if(SAFE_LOCK) {
            global $user;
            $gameEndTime = time();
            $block_user_key = self::LOCK_USER_KEY . $user->uid;

            //判断是否是黑名单用户
            if($this->redis->get($block_user_key)) {
                $data = array('status' => 4, 'msg' => '该用户为黑名单用户！');
                return $data;
            }

            //如果API提交的成绩低于安全成绩
            //设置用户黑名单 并且记录攻击日志
            $gameStartTime = $this->getGameStartTime();
            $gameTime = $gameEndTime - $gameStartTime;
            
            //取出游戏开始时间，计算游戏花费时间，判断是否为恶意刷新API
            //游戏时间小于安全事件 设置用户黑名单并且记录攻击日志
            if($gameStartTime == 0 || $gameTime < $recordInfo->timeinit || $recordInfo->records < SAFE_TIME) {
                //恶意用户锁定并记录日志
                $this->redis->set($block_user_key, 1);
                $attackLog = new \stdClass();
                $attackLog->uid = $user->uid;
                $attackLog->game_time = $gameTime;
                $attackLog->api_data = json_encode($recordInfo, 1);
                $this->insertAttackLog($attackLog);
                $data = array('status' => 5, 'msg' => '游戏成绩异常！');
                return $data;
            } 
        }
    }

    public function insertAttackLog($log)
    {
        $log->created = date('Y-m-d H:i:s');
        $log = (array) $log;
        $id = $this->helper->insertTable('attack_log', $log);
        if($id) {
            return $id;
        }
        return false;
    }

    public function getUidByGid($gameid) 
    {
        $sql = "SELECT `uid` FROM `record` WHERE `id` = :gid";
        $query = $this->_pdo->prepare($sql);
        $query->execute(array(':gid' => $gameid));
        $row = $query->fetch(\PDO::FETCH_ASSOC);
        if($row) {
            return $row['uid'];
        }
        return false;
    }

    public function findInfoByUid($uid) 
    {
        $sql = "SELECT `nickname`, `headimgurl` FROM `user` WHERE `uid` = :uid";
        $query = $this->_pdo->prepare($sql);
        $query->execute(array(':uid' => $uid));
        $row = $query->fetch(\PDO::FETCH_ASSOC);
        if($row) {
            return $row;
        }
        return false;
    }
}