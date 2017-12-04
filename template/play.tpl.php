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
    <link rel="stylesheet" type="text/css" href="css/bundle.min.css">
    <script type="text/javascript" src="js/bundle-vendor.min.js"></script>
</head>
<body>

<!-- 横屏代码 -->
<div id="orientLayer" class="mod-orient-layer">
    <div class="mod-orient-layer__content">
        <i class="icon mod-orient-layer__icon-orient"></i>
        <div class="mod-orient-layer__desc vertical">为了更好的体验，请解锁竖屏浏览<br><em>建议全程在wifi环境下观看</em></div>
        <div class="mod-orient-layer__desc landscape">为了更好的体验，请解锁横屏浏览<br><em>建议全程在wifi环境下观看</em></div>
    </div>
</div>

<div class="shareTips hidden">
    <a href="javascript:void(0);" class="close"></a>
</div>

<div id="dreambox">
    <div class="section" id="chose">
        <div class="slogan"></div>
        <div class="jue-se--chose">
            <div class="jue-se--large">
               <!-- Swiper -->
                <div class="swiper-container">
                    <div class="swiper-wrapper">
                      <div class="swiper-slide">
                        <div class="jue-se--item kl"></div>
                      </div>
                      <div class="swiper-slide">
                        <div class="jue-se--item qw"></div>
                      </div>
                      <div class="swiper-slide">
                        <div class="jue-se--item mhl"></div>
                      </div>
                    </div>
                </div>
            </div>
            <div class="swiper-pagination" id="jue-se-small">
                <div class="jue-se--item kl"></div>
                <div class="jue-se--item qw"></div>
                <div class="jue-se--item mhl"></div>
            </div>


        </div>
        <div class="start-btn"></div>
    </div>

    <div class="section" id="scene">
        
        <div class="gameTips">
            <a href="javascript:void(0);" class="iknow-btn"></a>
        </div>
        <div class="element"></div>

        <div id="gemeTime">
            <div class="timeArea">
                <!-- 正在加载... -->
            </div>
            <!-- <div class="gtContext"></div> -->
        </div>
        <div class="bg">
            <div class="scene-bg scene1"></div>
            <div class="scene-bg scene2"></div>
            <div class="scene-bg scene3"></div>
            <div class="scene-bg scene4"></div>
        </div>
    </div>

    <!-- 得分页面 -->
    <div class="section" id="scores">
        <div class="toplist-tag"></div>
        <div class="scores-show--context">   
            <div class="heartCount">- 个</div>
            <div class="timeCount">- 分 - 秒</div>
        </div>
        <div class="scores-btn--area">
            <a href="javascript:void(0);" class="replay-btn"></a>
            <a href="javascript:void(0);" class="gift-btn"></a>
        </div>
    </div>

    <!-- 游戏榜单 -->
    <div class="section" id="toplist">
        <div class="toplist-l">
            <div class="toplist-userinfo waiting">
                正在加载...
            </div>
            <div class="qrcode">
                <img src="img/qrcode.png" width="100%;">
            </div>
            <a href="javascript:void(0);" class="back-btn"></a>
        </div>
        <div class="toplist-r">
            <div class="toplist-table">
                <ul class="waiting">
                    正在加载...
                </ul>
            </div>
        </div>
    </div>

    <!-- 分享 -->
    <div class="section" id="share">
        <div class="share-con">
            <div class="head-star"></div>
            <div class="xmasVideo">
                <div class="poster"></div>
                <video src="media/test.mp4" poster="media/poster.jpg" playsinline webkit-playsinline id="xmas-video" width="100%">
                    您的浏览器不支持 video 标签。
                </video>
            </div>
            <div class="share-btn-area">
                <a href="javascript:location.reload();" class="replay-btn"></a>
                <a href="javascript:void(0);" class="list-btn"></a>
                <a href="javascript:void(0);" class="chose-buy-btn"></a>
            </div>
        </div>
    </div>


</div>


<audio src="media/bg-music.mp3" loop id="bgMusic">
您的浏览器不支持 audio 标签。
</audio>
<audio src="media/eat.wav" id="eatMusic">
您的浏览器不支持 audio 标签。
</audio>

<script type="text/javascript" src="js/bundle.min.js"></script>
<script type="text/javascript">
    document.body.addEventListener('touchmove', function(evt) {
        if(!evt._isScroller) {
            evt.preventDefault()
        }
    });
    var common = new Common();

    // 视频
    function XmasVideo(el){
        return {
            datas: {
                videoEl: null,
                posterEl: null
            },
            init: function(){
                var me  = this;
                me.render();
                me.bind();
            },
            render: function(){
                var me = this;
                me.datas.videoEl = document.getElementById('xmas-video');
                me.datas.posterEl = document.querySelector('.poster');
            },
            bind: function(){
                var me = this;
                me.datas.posterEl.onclick = function(){
                    if(!this.getAttribute("status")){
                        this.setAttribute("status","play");
                        me.datas.videoEl.play();
                        me.datas.posterEl.style.opacity = 0;
                    }else{
                        this.removeAttribute("status");
                        me.datas.videoEl.pause();
                        // me.datas.posterEl.style.opacity = 1;
                    }   
                }

                common.base.eventTester(me.datas.videoEl, 'ended', function(){
                    me.datas.posterEl.removeAttribute("status");
                    me.datas.posterEl.style.opacity = 1;
                });
            }
        }
    }

    var xmasVideo = new XmasVideo('.xmasVideo');

    



    function PageController(){
        if(!(this instanceof PageController)){
            var self = new PageController();
            self.init();
            return self;
        };

        this.container = {
            'giftBtn': null,
            'replayBtn': null,
            'toplistTag': null,
            'listBtn': null,
            'backBtn': null
        }
    } 

    PageController.prototype.init = function(){
        this.render();
        xmasVideo.init();
        // this.common.PageRouter('scene');
    }

    PageController.prototype.render = function(){
        this.container.giftBtn = document.querySelector('.gift-btn');
        this.container.replayBtn = document.querySelector('.replay-btn');
        this.container.listBtn = document.querySelector('.list-btn');
        this.container.backBtn = document.querySelector('.back-btn');
        this.container.toplistTag = document.querySelector('.toplist-tag');

        this.bind();
    }

    PageController.prototype.bind = function(){
        var me = this;
        me.container.giftBtn.addEventListener('click', function(){
            common.PageRouter('share');
        })

        me.container.replayBtn.addEventListener('click', function(){
            location.reload();
        })

        me.container.toplistTag.addEventListener('click', function(){
            common.PageRouter('toplist');
        })

        me.container.listBtn.addEventListener('click', function(){
            common.PageRouter('toplist');
            
        })

        me.container.backBtn.addEventListener('click', function(){
            common.PageRouter('scores');
        })

    }

    PageController();










    var swiper = null;
    common.PageRouter('chose', function(){
        if(swiper) return false;
        var jueSeItem = ['kl', 'qw', 'mhl'];
        swiper = new Swiper('.swiper-container',{
            // effect : 'fade',  // coverflow
            effect : 'flip',
            flip: {
                slideShadows : true,
                limitRotation : true,
            },
            slidesPerView: 1,
            centeredSlides: true,
            pagination: {
            el: '.swiper-pagination',
            clickable: true,
            renderBullet: function (index, className) {
              return `<div class="${className} jue-se--item ${jueSeItem[index]}"></div>`;
              // return '<div class="' + className + '">' + (index + 1) + '</div>';
            },
          },
        });
    });


    var startGo = document.querySelector('.start-btn')
    // 出发
    startGo.addEventListener('click', function(){
        hero.elClassName = swiper.activeIndex;
        common.PageRouter('scene');
    })



</script>
</body>
</html>