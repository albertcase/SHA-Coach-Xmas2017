<?php

namespace CampaignBundle;

use Core\Controller;
use Lib\Helper;
use Lib\PDO;
use Lib\UserAPI;
use Lib\WechatAPI;
use CampaignBundle\ApiController;

class PageController extends Controller
{

    public function __construct()
    {
        $this->_pdo = PDO::getInstance();
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

        $uid = (int) $this->getUidByGid($gameid);
        //自己
        if($user->uid == $uid) {
            $config = array();
            return $this->render('isplay', array('config' => $config));
        } else { //不是自己
            $userInfo = $this->findInfoByUid($uid);
            return $this->render('share', array('userInfo' => $userInfo));
        }
    }

    public function cardAction()
    {
        $card = 'pKCDxjovWJyOM64_yoYnlWnBh6RY';
        //$card = array('600'=>'pGXbRsjjVihQHceLiRMgpFWDkNtU', '800'=>'pGXbRssyzDNSGX7qa6D689Vi_700');
        //$card = array('600'=>'pKCDxji6wCVuB38LBgBTx3U2yBoQ', '800'=>'pKCDxji6wCVuB38LBgBTx3U2yBoQ');
    
        $wechatapi = new WechatAPI();
        $list = $wechatapi->cardList($card);
        return $this->render('card', array('list'=>$list));
        exit;
    }

    public function gameAction()
    {
        $api = new ApiController();
        $api->gameStart(); 
        $config = array();
        return $this->render('play', array('config' => $config));
    }

    public function clearCookieAction()
    {
      	$request = $this->Request();
	    setcookie('_user', '', time(), '/', $request->getDomain());
	    $this->statusPrint('success');
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
