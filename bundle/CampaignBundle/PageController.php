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

    public function shareAction()
    {
        global $user;
        $api = new ApiController();
        $isPlay = $api->findRecordByUid($user->uid);
        $config = array('isPlay' => (int)$isPlay);
        return $this->render('share', array('config' => $config));
    }

    public function gameAction()
    {
        $config = array();
        return $this->render('play', array('config' => $config));
    }

    public function clearCookieAction()
    {
      	$request = $this->Request();
	    setcookie('_user', '', time(), '/', $request->getDomain());
	    $this->statusPrint('success');
    }

}
