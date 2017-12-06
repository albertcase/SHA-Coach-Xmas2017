<?php

namespace CampaignBundle;

use Core\Controller;
use Lib\Helper;
use Lib\PDO;
use Lib\UserAPI;
use Lib\WechatAPI;
use Lib\Redis;
use CampaignBundle\OpenApiController;

class ApiController extends Controller
{
    public function __construct() {

   	    global $user;
        
        parent::__construct();
        if(!$user->uid) {
            $this->statusPrint('100', 'access deny!');
        }
        $this->_pdo = PDO::getInstance();
        $this->helper = new Helper();
    }

    public function toptenAction()
    {
        global $user;
        $openApi = new OpenApiController();
        $topten = $openApi->getTopten();
        $userRecords = $this->findRecordByUid($user->uid);
        $userNum = $this->findUserRecordNum($userRecords['records']);
        $result = array(
            'status' => 1,
            'msg' => '获取成功！',
            'topten' => $topten,
            'myRecord' => $openApi->recordsFormat($userRecords['records']),
            'myNum' => $userNum + 1,
            );
        $this->dataPrint($result);
    }

    /**
     * 
     */ 
    public function recordAction()
    {
    	global $user;

        $request = $this->request;
        $fields = array(
            'records' => array('notnull', '120'),
            'animal' => array('notnull', '120'),
            'bar' => array('notnull', '120'),
        );
        $request->validation($fields);

        $recordInfo = new \stdClass();
        $recordInfo->uid = $user->uid;
        $recordInfo->records = $request->request->get('records');
        $recordInfo->animal = $request->request->get('animal');
        $recordInfo->bar = $request->request->get('bar');

        // API安全处理
        $this->checkSafe($recordInfo);

        // lock 5s 5s中提交一次成绩
        $redis = Redis::getInstance();
        $floodkey = 'flood:' . $user->uid;

        if($redis->get($floodkey)) {
            $data = array('status' => 2, 'msg' => '您的操作过于频繁！请稍后再试！');
            $this->dataPrint($data);
        }
        $redis->set($floodkey, 1);
        $redis->setTimeout($floodkey, 5);

        // 保存成绩
  		$result = $this->saveRecord($recordInfo); 
  		$this->dataPrint($result);
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
    	$isMax = $this->findMaxRecord($recordInfo);
    	$result = array();
        $redis = Redis::getInstance();
        $floodkey = 'flood:' . $user->uid;
        $gameid = isset($playInfo['id']) ? $playInfo['id'] : 0;
        $share_url = 'http://xmas2017.coach.samesamechina.com/share/'. $gameid;

    	//1.[1,1]刷新成绩 2.[1,0] or [0,1]重复未刷新成绩 3.[0,0]第一次玩游戏
    	$recordStatus = (int)$isPlay + (int)$isMax;

    	switch ($recordStatus) {
    		case 0:
    			$rs = $this->insertRecord($recordInfo);
                $redis->setTimeout($floodkey, 0);
    			if($rs) {
    				$result = array('status' => 1, 'msg' => '成绩保存成功！', 'share_url' => $share_url);
    			} else {
    				$result = array('status' => 0, 'msg' => '成绩保存失败！', 'share_url' => $share_url);
    			}
    			break;
    		
    		case 1:
                $redis->setTimeout($floodkey, 0);
				$result = array('status' => 3, 'msg' => '很遗憾！您未刷新成绩！', 'share_url' => $share_url);
    			break;

			case 2:
    			$rs = $this->updateRecord($recordInfo);
                $redis->setTimeout($floodkey, 0);
    			if($rs) {
    				$result = array('status' => 1, 'msg' => '成绩保存成功！', 'share_url' => $share_url);
    			} else {
    				$result = array('status' => 0, 'msg' => '成绩保存失败！', 'share_url' => $share_url);
    			}
    			break;	

    		default:
    			break;
    	}
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
    	$sql = "SELECT COUNT(id) AS sum FROM `record` WHERE `uid` = :uid AND `records` > :records";
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
        $helper = new Helper();
        $recordInfo->created = date('Y-m-d H:i:s');
        $recordInfo->updated = date('Y-m-d H:i:s');
        $recordInfo = (array) $recordInfo;
        $id = $helper->insertTable('record', $recordInfo);
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

    public function gameStart()
    {
        if(!SAFE_LOCK) { 
            return true;
        }

        // 开启安全模式
        global $user;
        $request = $this->request;
        $redis = Redis::getInstance();
        $time = time();

        $uuid = $this->helper->uuidGenerator();
        setcookie('7dc4b594a1ee58d', $uuid, $time + 300, '/', $request->getDomain());
        $redisKey = 'start:' . $user->uid . $uuid;
        $redis->set($redisKey, $time);
    }

    public function checkSafe($recordInfo)
    {
        if(!SAFE_LOCK) { 
            return true;
        } 

        global $user;
        $request = $this->request;
        $redis = Redis::getInstance();
        $time = time();
        $floodkey = 'flood:' . $user->uid;
        $block_key = 'block:' . $user->uid;

        if($recordInfo->records < SAFE_TIME) {
            $attackLog = new \stdClass();
            $attackLog->uid = $user->uid;
            $attackLog->game_time = $recordInfo->records;
            $attackLog->api_data = json_encode($recordInfo, 1);
            $this->insertAttackLog($attackLog);
            $data = array('status' => 3, 'msg' => '该成绩异常！');
            $this->dataPrint($data);
        }

        if($redis->get($block_key)) {
            $data = array('status' => 4, 'msg' => '该用户为黑名单用户！');
            $this->dataPrint($data);
        }

        $uuid = isset($_COOKIE['7dc4b594a1ee58d']) ? $_COOKIE['7dc4b594a1ee58d'] : 0;

        $redisKey = 'start:' . $user->uid . $uuid;
        if($redis->get($redisKey)) {
            $startTime = $redis->get($redisKey);
            $gameTime = $time - $startTime;
            if($gameTime < SAFE_TIME) {
                //恶意用户锁定并记录日志
                $redis->set($block_key, 1);
                $attackLog = new \stdClass();
                $attackLog->uid = $user->uid;
                $attackLog->gameTime = $gameTime;
                $attackLog->api_data = json_encode($recordInfo, 1);
                $this->insertAttackLog($attackLog);
            }
        }
        exit;  
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

}
