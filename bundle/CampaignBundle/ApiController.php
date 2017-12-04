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
        $userNum = $this->findUserRecordNum((float)$userRecords['records']);
        $result = array(
            'topten' => $topten,
            'myRecord' => $openApi->recordsFormat($userRecords['records']),
            'myNum' => $userNum,
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

        // lock 5s 5s中提交一次成绩
        $redis = Redis::getInstance();
        if($redis->get($user->uid)) {
            $data = array('status' => 2, 'msg' => '您的操作过于频繁！请稍后再试！');
            $this->dataPrint($result);
        }
        $redis->set($user->uid, 1);
        $redis->setTimeout($user->uid, 60);

        // 保存成绩
  		$result = $this->saveRecord($recordInfo); 
  		$this->dataPrint($result);
    }

    /**
     * 游戏成绩
     */ 
    public function saveRecord($recordInfo)
    {
    	$isPlay = $this->findRecordByUid($recordInfo->uid);
    	$isMax = $this->findMaxRecord($recordInfo);
    	$result = array();

    	//1.[1,1]刷新成绩 2.[1,0] or [0,1]重复未刷新成绩 3.[0,0]第一次玩游戏
    	$recordStatus = (int)$isPlay + (int)$isMax;

    	switch ($recordStatus) {
    		case 0:
    			$rs = $this->insertRecord($recordInfo);
    			if($rs) {
    				$result = array('status' => 1, 'msg' => '成绩保存成功！');
    			} else {
    				$result = array('status' => 0, 'msg' => '成绩保存失败！');
    			}
    			break;
    		
    		case 1:
				$result = array('status' => 0, 'msg' => '成绩保存失败！');
    			break;

			case 2:
    			$rs = $this->updateRecord($recordInfo);
    			if($rs) {
    				$result = array('status' => 1, 'msg' => '成绩保存成功！');
    			} else {
    				$result = array('status' => 0, 'msg' => '成绩保存失败！');
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
}
