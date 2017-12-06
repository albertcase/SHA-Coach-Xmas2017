<?php
define('SITE_URL', dirname(dirname(__FILE__)));
require_once SITE_URL . "/vendor/autoload.php";
require_once SITE_URL . "/config/config.php";

use Lib\Redis;

$redis = Redis::getInstance();
$uid = isset($argv[1]) ? $argv[1] : 0;
$blockKey = 'block:' . $uid;
$redis->setTimeout($blockKey, 0);
var_dump($redis->get($blockKey));

if(!$redis->get($blockKey)) {
	echo "clear block success!\n";
} else {
	echo "clear block failed!\n";
}

exit;
?>