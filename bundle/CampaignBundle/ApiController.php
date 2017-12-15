<?php

namespace CampaignBundle;

use Core\Controller;
use Lib\Helper;

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
            if($userRecords['status'] == 0) {
                $myRecord = '暂无成绩';
                $userRank = '暂无排';
            } else {
                $myRecord = $this->coachLib->recordsFormat($userRecords['records']);
                $userRank = $this->coachLib->findUserRecordNum($userRecords['records']);
            }
            $result = array(
                'status' => 1,
                'msg' => '获取成功！',
                'topten' => $topten,
                'myRecord' => $myRecord,
                'myNum' => $userRank,
                );
            $this->dataPrint($result);
        }
        $this->dataPrint(array('status' => 0));
    }

    /**
     * 提交成绩
     */ 
    public function recordAction()
    {
    	global $user;
        $base64raw = file_get_contents("php://input");
        $raw = json_encode(base64_decode($base64raw));
        $encrypted = json_decode($raw);
        $helper = new Helper();
        $password = '490ce5d064d2eb209dddaa118f7a6831';
        $decrypted = $helper->cryptoJsAesDecrypt($password, $encrypted);
        if(!$decrypted) {
           file_put_contents('/data/log/api.log', "uid: {$user->uid},\t contents: {$base64raw}\n", FILE_APPEND);
            $this->dataPrint(array('msg' => 'error'));
        }
        $data = json_decode($decrypted);
        $recordInfo = new \stdClass();
        $recordInfo->uid = $user->uid;
        $recordInfo->records = (float)$data->records;
        $recordInfo->animal = $data->animal;
        $recordInfo->bar = $data->bar;
        $recordInfo->timeinit = (float)$data->timeinit;

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
        $this->coachLib->delGameStartTime();
        $this->coachLib->unsetFloodLock($user->uid);
  		$this->dataPrint($result);
    }

}
