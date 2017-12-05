
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
    <link rel="stylesheet" type="text/css" href="./build/dist/css/bundle.min.css">
    <script type="text/javascript">
        document.write('<script type="text/javascript" src="http://coach.samesamechina.com/api/v1/js/a77f2b6c-bad1-4f28-9fdb-e453787882dd/wechat?v='+ Math.random()+'"><\/script>');
    </script>
    <script type="text/javascript" src="./build/dist/js/bundle-vendor.min.js"></script>
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
                <img src="img/avatar.jpg" width="100%">
            </div>
        </div>
        <div class="user-txt"></div>
        <div class="user-btn-area">
            <a href='javascript:void(0);' class="open-btn"></a>
            <a href='javascript:void(0);' class="iplay-btn"></a>
            <a href='javascript:void(0);' class="chose-buy-btn"></a>
        </div>
    </div>

    <div class="section show" id="share">
        <div class="head-star"></div>
        <div class="xmasVideo"></div>
        <div class="share-btn-area">
            <a href="/game" class="replay-btn"></a>
            <a href="javascript:void(0);" class="list-btn"></a>
            <a href="javascript:void(0);" class="chose-buy-btn"></a>
        </div>
    </div>

</div>
<?php
    var_dump($config);
?>
<script type="text/javascript">
    var common = new Common();
    common.base.wxshareFun();

    function XmasVideo(el){
        return {
            datas: {
                parentEl: document.querySelector(el),
                path: './build/dist/media/test.mp4',
                poster: './build/dist/media/poster.jpg',
                posterEl: null,
                el: null,
                videoWidth: 0
            },
            init: function(){
                var me  = this;
                me.render();
            },
            render: function(){
                var me = this;
                me.datas.videoWidth = parseInt(window.getComputedStyle(me.datas.parentEl).width, 10);
                me.create();
            },
            create: function(){
                var me = this;

                var posterEl = document.createElement('div');
                posterEl.className = 'posterEl';
                me.datas.posterEl = posterEl;
                me.datas.parentEl.appendChild(posterEl);

                var el = document.createElement('video');
                el.id = 'xmas-video';
                el.src = me.datas.path;
                el.poster = me.datas.poster;
                el.width = me.datas.videoWidth;
                el.setAttribute('playsinline', '');
                el.setAttribute('webkitPlaysinline', '');
                el.innerHTML = '您的浏览器不支持 video 标签。';
                me.datas.el = el;
                me.datas.parentEl.appendChild(el);
                

                me.bind();
            },
            bind: function(){
                var me = this;
                me.datas.posterEl.onclick = function(){
                    if(!this.getAttribute("status")){
                        this.setAttribute("status","play");
                        me.datas.el.play();
                        me.datas.posterEl.style.opacity = 0;
                    }else{
                        this.removeAttribute("status");
                        me.datas.el.pause();
                        // me.datas.posterEl.style.opacity = 1;
                    }  
                    // me.datas.el.play();
                    // me.datas.posterEl.style.visibility = 'hidden';
                }
            }
        }
    }

    var xmasVideo = new XmasVideo('.xmasVideo');
    xmasVideo.init();



    // 成绩榜
    function Toplist(id, eventEl, toplistJson){
        if(!(this instanceof Toplist)){
            var self = new Toplist(id, eventEl, toplistJson);
            self.init();
            return self;
        };
        return {
            init: function(){
                this.render();
            },
            setting: {
                id: id,
                popupFrame: null,
                eventEl: eventEl,
                listDatas: toplistJson
            },
            render: function(){
                var me = this;
                me.setting.popupFrame = common.Popup(me.setting.id, me.do(), me.setting.eventEl);
            },
            do: function(){
                var me = this;
                var jsonDatas = me.setting.listDatas; 

                var dataslistHTML;
                if(jsonDatas.length <= 0){
                    dataslistHTML = '暂无数据！';
                }else{
                    var dataslistArray = [];
                    for(var i = 0; i < jsonDatas.length; i++){
                        dataslistArray.push(`<li><span>${jsonDatas[i]['nickname']}</span><span>${jsonDatas[i]['records']}</span></li>`);
                    }
                    dataslistHTML = `<div class="toplistScroll">
                        <div class="toplist-popup--context">
                            <ul>
                                ${dataslistArray.join('')}
                            </ul>
                        </div>
                    </div>
                    `;
                }

                
                return dataslistHTML;
            },
            show: function(){
                this.setting.popupFrame.show();
            },
            hide: function(){
                this.setting.popupFrame.hide();
            }
        }
    }

    var toplistObj;
    document.querySelector('.list-btn').addEventListener('click', function(){
        if(toplistObj){
            toplistObj.show()
        }else{
            common.fetch.authorize({}, function(data){
                toplistObj = Toplist('toplist-popup', '.list-btn', data.topten);
                toplistObj.show();
            });
        }
    })



</script>




</body>
</html>

