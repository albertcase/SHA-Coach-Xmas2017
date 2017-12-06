<!DOCTYPE HTML>
<html>
<head>
    <title>coach</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="format-detection" content="telephone=no">
    <!-- uc强制竖屏 -->
    <meta name="screen-orientation" content="landscape">
    <!-- QQ强制竖屏 -->
    <meta name="x5-orientation" content="landscape">

    <!-- <link rel="apple-touch-startup-image" href="/build/assets/img/bg1.png" />
 -->
    <!--禁用手机号码链接(for iPhone)-->
    <meta name="viewport" content="width=device-width,initial-scale=1.0,user-scalable=0,minimum-scale=1.0,maximum-scale=1.0,minimal-ui" />
    <!--自适应设备宽度-->
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <!--控制全屏时顶部状态栏的外，默认白色-->
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="Keywords" content="">
    <meta name="Description" content="...">
    <link rel="stylesheet" type="text/css" href="/build/dist/css/bundle.min.css">
    <script type="text/javascript">
        document.write('<script type="text/javascript" src="http://coach.samesamechina.com/api/v1/js/a77f2b6c-bad1-4f28-9fdb-e453787882dd/wechat?v='+ Math.random()+'"><\/script>');
    </script>
    <script type="text/javascript" src="/build/dist/js/bundle-vendor.min.js"></script>
    <style type="text/css">
        #orientLayer { display: none; }
        @media screen and (min-aspect-ratio: 13/9) { 
            #orientLayer { display: block; } 
        }
    </style>
</head>
<body>

<div id="orientLayer" class="mod-orient-layer">
    <div class="mod-orient-layer__content">
        <i class="icon mod-orient-layer__icon-orient"></i>
        <div class="mod-orient-layer__desc">为了更好的体验，请解锁竖屏浏览<br><em>建议全程在wifi环境下观看</em></div>
    </div>
</div>

<div id="dreambox">

    <div class="section" id="friend">
        <div class="user-photo">
            <div class="user-photo-con">
                <img src="<?php echo $userInfo['headimgurl']; ?>" width="100%">
            </div>
        </div>
        <div class="user-txt"></div>
        <div class="user-btn-area">
            <a href='javascript:void(0);' class="open-btn"></a>
            <a href='javascript:void(0);' class="iplay-btn"></a>
            <a href='javascript:void(0);' class="chose-buy-btn"></a>
        </div>
    </div>

</div>



<script type="text/javascript">
    var common = new Common();
    common.base.wxshareFun();
    common.PageRouter('friend');
</script>




</body>
</html>

