<?php

namespace CampaignBundle;

use Core\Controller;
use Lib\WechatAPI;

class PageController extends Controller
{

    public function __construct()
    {
        $this->coachLib = new CoachXmasLib();
    }

    public function indexAction()
    {   
        echo "coache-xmas2017";
        $config = array('name' => '122');
        return $this->render('index', array('config' => $config));
    }

    public function shareAction($gameid)
    {
        global $user;
        $uid = $this->coachLib->getUidByGid($gameid);
        //自己
        if($user->uid == $uid) {
            return $this->render('isplay', array('config' => []));
        } else { //不是自己

            //卡券
            $card = 'pKCDxjlqFHHJMYpHo4hmTg1KF7Zk';
            $wechatapi = new WechatAPI();
            $list = $wechatapi->cardList($card);

            $userInfo = $this->coachLib->findInfoByUid($uid);
            return $this->render('share', array('userInfo' => $userInfo, 'list' => $list));
        }
    }

    public function gameAction()
    {
        $this->coachLib->gameStart(); 
        return $this->render('play', array('config' => []));
    }

    public function clearCookieAction()
    {
      	$request = $this->Request();
	    setcookie('d0d38ad3', '', time(), '/', $request->getDomain());
	    $this->statusPrint('success');
    }
}
