<?php

$routers = array();
//System
$routers['/wechat/callback'] = array('WechatBundle\Wechat', 'callback');
$routers['/wechat/coach/callback'] = array('WechatBundle\Coach', 'callback');
$routers['/wechat/coach/receive'] = array('WechatBundle\Coach', 'receiveUserInfo');
$routers['/wechat/jssdk/config/js'] = array('WechatBundle\Wechat', 'jssdkConfigJs');
$routers['/simulation/login'] = array('WechatBundle\Wechat', 'simulationLogin');
$routers['/clear'] = array('CampaignBundle\Page', 'clearCookie');
//System end

//Campaign
$routers['/ajax/post'] = array('CampaignBundle\Api', 'form');
$routers['/'] = array('CampaignBundle\Page', 'index');
$routers['/game'] = array('CampaignBundle\Page', 'game');
$routers['/share/%'] = array('CampaignBundle\Page', 'share');

//API
$routers['/api/record'] = array('CampaignBundle\Api', 'record');
$routers['/api/omg/topten'] = array('CampaignBundle\OpenApi', 'topten');
$routers['/api/topten'] = array('CampaignBundle\Api', 'topten');
