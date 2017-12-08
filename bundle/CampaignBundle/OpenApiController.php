<?php

namespace CampaignBundle;

use Core\Controller;

class OpenApiController extends Controller
{

    public function toptenAction()
    {
        $coachXmasLib = new CoachXmasLib();
        $result = $coachXmasLib->getTopten();
        $return = array('status' => 1, 'msg' => '获取成功！', 'list' => $result); 
        $this->dataPrint($return);
    }
}
