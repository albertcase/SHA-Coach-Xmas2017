<?php

namespace CampaignBundle;

use Core\Controller;
use Lib\Helper;
use Lib\PDO;
use Lib\UserAPI;
use Lib\WechatAPI;
use Lib\Redis;
use CampaignBundle\ApiController;

class OpenApiController extends Controller
{
    public function __construct() {

        parent::__construct();

        $this->_pdo = PDO::getInstance();
    }

    public function toptenAction()
    {
        $api = new ApiController();
        $result = $api->findToptenRecord();
        var_dump($result);exit;
        $this->dataPrint($result);
    }
}
