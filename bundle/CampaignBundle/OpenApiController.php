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
        if(OPEN_CACHE) {
            $redis = Redis::getInstance();
            if($redis->get(self::CACHE_KEY)) {
                $topten = json_decode($redis->get(self::CACHE_KEY), 1);
                return $topten;
            }
            $topten = $this->findToptenRecord();
            $redis->set(self::CACHE_KEY, json_encode($topten, 1));
            $redis->setTimeout(self::CACHE_KEY, CACHE_TIME);
            return $topten;
        }
        $topten = $this->findToptenRecord();
        return $topten;
    }

    # 格式化成绩
    public function recordsFormat($records)
    {
        if($records) {
            $records= sprintf('% .2f', $records);
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
        $sql = "SELECT u.`nickname`, r.`records` FROM `user` u, `record` r WHERE u.`uid` = r.`uid` ORDER BY r.`records` ASC LIMIT 0, 10";
        $query = $this->_pdo->prepare($sql);
        $query->execute();
        $row = $query->fetchAll(\PDO::FETCH_ASSOC);
        if($row) {
            foreach ($row as $k => $v) {
                $row[$k]['records'] = $this->recordsFormat($v['records']);
            }
            return $row;
        }
        return false;
    }
}
