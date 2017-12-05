<?php

define("BASE_URL", 'http://127.0.0.1:9123/');
define("TEMPLATE_ROOT", dirname(__FILE__) . '/../template');
define("VENDOR_ROOT", dirname(__FILE__) . '/../vendor');

//ENV
define("ENV", 'prod');

//User
define("USER_STORAGE", 'COOKIE');

//
define("WECHAT_CAMPAIGN", true);

//Wechat Vendor
define("WECHAT_VENDOR", 'coach'); // default | coach | same

//Wechat config info
define("TOKEN", '');
define("APPID", '');
define("APPSECRET", '');
define("NOWTIME", date('Y-m-d H:i:s'));
define("AHEADTIME", '1000');

define("NONCESTR", '?????');
define("COACH_AUTH_URL", 'http://coach.samesamechina.com/api/wechat/oauth/auth/a09f8a9a-64d7-429b-944f-1062060583fa');
define("COACH_TOKEN", 'zcBpBLWyAFy6xs3e7HeMPL9zWrd7Xy');

define("SAME_OAUTH_URL", '');

//Redis config info
define("REDIS_HOST", '127.0.0.1');
define("REDIS_DBNAME", 1);
define("REDIS_PORT", '6379');

//Database config info
define("DBHOST", '127.0.0.1');
define("DBUSER", 'root');
define("DBPASS", '');
define("DBNAME", 'coach_xmas2017');

//Wechat Authorize
define("CALLBACK", 'wechat/callback');
define("SCOPE", 'snsapi_base');

//Wechat Authorize Page
define("AUTHORIZE_URL", '[
	"/game"
]');

//Account Access
define("OAUTH_ACCESS", '{
	"xxxx": "samesamechina.com"
}');
define("JSSDK_ACCESS", '{
	"xxxx": "samesamechina.com",
	"dev": "127.0.0.1"
}');

define("ENCRYPT_KEY", '29FB77CB8E94B358');
define("ENCRYPT_IV", '6E4CAB2EAAF32E90');

define("WECHAT_TOKEN_PREFIX", 'wechat:token:');

//topten cache
define("OPEN_CACHE", true);
define("CACHE_TIME", 60);

//safe lock
define("SAFE_LOCK", false);
define("SAFE_TIME", 32);
