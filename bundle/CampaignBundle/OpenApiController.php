<?php

namespace CampaignBundle;

use Core\Controller;

class OpenApiController extends Controller
{

	public function __construct() 
	{
		// ajax 请求的处理方式 
        if(isset($_SERVER["HTTP_X_REQUESTED_WITH"]) && strtolower($_SERVER["HTTP_X_REQUESTED_WITH"])=="xmlhttprequest"){ 
            //@TODO ? 
        } else{ 
            $this->statusPrint('101', 'access deny!');
        }
	}

    public function toptenAction()
    {
        $coachXmasLib = new CoachXmasLib();
        $result = $coachXmasLib->getTopten();
        $return = array('status' => 1, 'msg' => '获取成功！', 'list' => $result); 
        $this->dataPrint($return);
    }

    public function cardAction()
    {
        $coachXmasLib = new CoachXmasLib();
        $cards = $coachXmasLib->getCards();
        if($cards) {
        	$return = array('status' => 1, 'msg' => '获取成功！', 'cards' => $cards); 
        } else {
        	$return = array('status' => 0, 'msg' => '获取失败！'); 
        }
        $this->dataPrint($return);
    }
}
