<?php

namespace CampaignBundle;

use Core\Controller;
use Lib\Helper;
use Lib\PDO;
use Lib\UserAPI;
use Lib\WechatAPI;
use Lib\Redis;

class OpenApiController extends Controller
{
    const CACHE_KEY = 'topten';

    public function __construct() {

        parent::__construct();

        $this->_pdo = PDO::getInstance();
    }

    public function toptenAction()
    {
        $result = $this->getTopten();
        $return = array('status' => 1, 'msg' => '获取成功！', 'list' => $result); 
        $this->dataPrint($return);
    }

    public function getTopten()
    {
        if(OPEN_CACHE == true) {
            $redis = Redis::getInstance();;
            if($redis->get(self::CACHE_KEY)) {
                $result = json_decode($redis->get(self::CACHE_KEY), 1);
            } else {
                $result = $this->findToptenRecord();
                if(!$result) {
                    $result = array();  
                } else{
                    foreach ($result as $k => $v) {
                        $result[$k]['records'] = $this->recordsFormat($v['records']);
                    }
                    $redis->set(self::CACHE_KEY, json_encode($result, 1));
                    $redis->setTimeout(self::CACHE_KEY, CACHE_TIME);
                }
            }
        } else {
            $result = $this->findToptenRecord();
            foreach ($result as $k => $v) {
                $result[$k]['records'] = $this->recordsFormat($v['records']);
            }
        }
        return $result;
    }

    # 格式化成绩
    public function recordsFormat($records)
    {
        if($records) {
            $times = explode('.', $records);
            $minute = (int) ($times[0] / 60);   
            $second = $times[0] % 60;
            return "{$minute}分{$second}秒{$times[1]}";
        } else {
            return "0分0秒0";
        }
    }

    public function findToptenRecord()
    {
        $sql = "SELECT u.`nickname`, r.`records` FROM `user` u, `record` r WHERE u.`uid` = r.`uid` ORDER BY r.`records` LIMIT 0, 10";
        $query = $this->_pdo->prepare($sql);
        $query->execute();
        $row = $query->fetchAll(\PDO::FETCH_ASSOC);
        if($row) {
            return $row;
        }
        return false;
    }
}
