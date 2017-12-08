<?php

namespace CampaignBundle;

use Core\Controller;

class ApiController extends Controller
{

    public function __construct() {

   	    global $user;
        
        parent::__construct();

        if(!$user->uid) {
            $this->statusPrint('100', 'access deny!');
        }
        $this->coachLib = new CoachXmasLib();
    }

    public function toptenAction()
    {
        global $user;
        $topten = $this->coachLib->getTopten();
        $userRecords = $this->coachLib->findRecordByUid($user->uid);
        if($userRecords) {
            $userNum = $this->coachLib->findUserRecordNum($userRecords['records']);
        } else {
            $userNum = '暂无排名';
        }

        $result = array(
            'status' => 1,
            'msg' => '获取成功！',
            'topten' => $topten,
            'myRecord' => $this->coachLib->recordsFormat($userRecords['records']),
            'myNum' => $userNum + 1,
            );
        $this->dataPrint($result);
    }

    /**
     * 提交成绩
     */ 
    public function recordAction()
    {
    	global $user;

        $request = $this->request;
        $fields = array(
            'records' => array('notnull', '120'),
            'animal' => array('notnull', '120'),
            'bar' => array('notnull', '120'),
            'timeinit' => array('notnull', '120'),
        );
        $request->validation($fields);

        $recordInfo = new \stdClass();
        $recordInfo->uid = $user->uid;
        $recordInfo->records = (float)$request->request->get('records');
        $recordInfo->animal = $request->request->get('animal');
        $recordInfo->bar = $request->request->get('bar');
        $recordInfo->timeinit = (float)$request->request->get('timeinit');
        
        // API安全处理
        if($data = $this->coachLib->checkSafe($recordInfo)) {
            $this->dataPrint($data);
        }

        // lock 5s 5s中提交一次成绩
        if($this->coachLib->getFloodLock($user->uid)) {
            $data = array('status' => 2, 'msg' => '您的操作过于频繁！请稍后再试！');
            $this->dataPrint($data);
        }
        $this->coachLib->setFloodLock($user->uid);

        // 保存成绩
  		$result = $this->coachLib->saveRecord($recordInfo); 
        $this->coachLib->unsetFloodLock($user->uid);
  		$this->dataPrint($result);
    }

}
