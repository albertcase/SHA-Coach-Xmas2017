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
define("OPEN_CACHE", false);
define("CACHE_TIME", 60);

//safe lock
define("SAFE_LOCK", true);
define("SAFE_TIME", 15);

//card
define("CARD_DATE", '2017-12-12');
define("CARD_LIST", '{
	"2017-12-13": "pKCDxjiGkHsWlMDDAfuSnxs2Ales",
	"2017-12-14": "pKCDxjlniXEqC1WeisXYZaS4lJJI",
	"2017-12-15": "pKCDxju0XSHvk7YpUVxTU0PIay2k",
	"2017-12-16": "pKCDxjrkuj9aGvIjOGLWiANjzeBc",
	"2017-12-17": "pKCDxjtjoLAQXGQ1Sj-1QteZvUOw",
	"2017-12-18": "pKCDxjvBWIo-q6FCbKe7DHoZZA4Q",
	"2017-12-19": "pKCDxjh43s3a9zzmuPA1fqZqugc8",
	"2017-12-20": "pKCDxjpkPTnHVYK6aMt7VT2lhPBw",
	"2017-12-21": "pKCDxjmhSb41wV5_qjfDLPczBUpI",
	"2017-12-22": "pKCDxjrM_y6Nvo4PCYP56oamJdFw",
	"2017-12-23": "pKCDxjrkDdJ-jQ_xGfuXddByBoFY",
	"2017-12-24": "pKCDxjo2Xf34JxM6A7o8Vre42w1U",
	"2017-12-25": "pKCDxjgOu8xX6LEQpUmZubtiAs5A"
}');
