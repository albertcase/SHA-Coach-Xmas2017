<?php
define('SITE_URL', dirname(dirname(__FILE__)));
require_once SITE_URL . "/vendor/autoload.php";
require_once SITE_URL . "/config/config.php";

use Lib\Redis;
use Lib\Helper;
use Lib\PDO;

$gn = new GetNickname();
$gn->getName();

exit;

class GetNickname
{
	private $_pdo;
	private $helper;

	public function __construct()
	{
		$this->_pdo = PDO::getInstance();
        $this->helper = new Helper();
	}

	public function getName()
	{
		$sql = "SELECT `uid`, `openid`, `sex`, `city` FROM `user` where nickname = ''";
        $query = $this->_pdo->prepare($sql);
        $query->execute();
        while($row = $query->fetch(\PDO::FETCH_ASSOC)) {
        	$apiObj = $this->getNicknameByWechat($row['openid']);
        	if($apiObj->sex == $row['sex'] || $apiObj->city == $row['city']) {
        		$userInfo = new \stdClass();
        		$userInfo->nickname = $apiObj->nickname;
        		$rs = $this->updateUserInfo($row['uid'], $userInfo);
        		if($rs) {
        			echo "{$row['openid']} update success!\n";
        		} else {
        			echo "{$row['openid']} update failed!\n";
        		}
        	} else {
        		echo "user failed!\n";
        	}
        }
	}

	public function getNicknameByWechat($openid)
	{
		$apiurl = 'http://coach.samesamechina.com/v2/wx/users/no_cache/' . $openid . '?access_token=zcBpBLWyAFy6xs3e7HeMPL9zWrd7Xy';
		$apiJson = $this->getdata($apiurl);
		$apiData = json_decode($apiJson);
		return $apiData;
	}

	public function updateUserInfo($uid, $info)
    {
        $condition = array(
            array('uid', $uid, '='),
        );
        return $this->helper->updateTable('user', $info, $condition);
    }

	private function getdata($url)
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json; charset=utf-8"));
        curl_setopt($ch, CURLOPT_POSTFIELDS, '{}');
        $data = curl_exec($ch);
        curl_close($ch);
        return $data;
    }

}

?>