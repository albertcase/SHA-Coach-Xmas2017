// Common.js
;(function(w, $){

    Array.prototype.unique = function(){
        var res = [];
        var json = {};
        for(var i = 0; i < this.length; i++){
          if(!json[this[i]]){
            res.push(this[i]);
            json[this[i]] = 1;
          }
        }
        return res;
    }

	function Common(){}


    Common.prototype.base = {
        init: function(){
            // this.wxshareFun();

            // document.body.addEventListener('touchmove', function(evt) {
            //     if(!evt._isScroller) {
            //         evt.preventDefault()
            //     }
            // });

            // var self = this;
            // self.ajaxFun("POST", "/jssdk", {
            //     url: shareArr['_url']
            // }, "json", function(data){
            //     // console.log(data);
            //     self.wechatFun(data.appId, data.timestamp, data.nonceStr, data.signature);
            // });
        },
        loadFn: function(arr , fn , fn2){
            var loader = new PxLoader();
                for( var i = 0 ; i < arr.length; i ++)
                {
                    loader.addImage(arr[i]);
                };
                
                loader.addProgressListener(function(e) {
                        var percent = Math.round( e.completedCount / e.totalCount * 100 );
                        if(fn2) fn2(percent)
                }); 
                
                
                loader.addCompletionListener( function(){
                    if(fn) fn();    
                });
                loader.start(); 
        },
        wxshareFun: function(){  //分享信息重置函数
            //wx.config({"debug": true}); 
            wx.ready(function(){

                /* ----------- 禁用分享 开始 ----------- */
                wx.hideMenuItems({
                  menuList: [
                    //'menuItem:share:appMessage', // 分享到朋友
                    //'menuItem:share:timeline', // 分享到朋友圈
                    'menuItem:copyUrl' // 复制链接
                  ],
                  success: function (res) {
                    // alert('已隐藏“阅读模式”，“分享到朋友圈”，“复制链接”等按钮');
                  },
                  fail: function (res) {
                      //alert(JSON.stringify(res));
                  }
                });
                /* ----------- 禁用分享 结束 ----------- */

                // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
                wx.onMenuShareAppMessage({
                    title: shareArr._title,
                    desc: shareArr._desc_friend,
                    link: shareArr._link,
                    imgUrl: shareArr._imgUrl,
                    type: '',
                    dataUrl: '',
                    success: function () {
                        shareArr._shareAppMessageCallback();
                    },
                    cancel: function () {

                    }
                });
                wx.onMenuShareTimeline({
                    title: shareArr._desc,
                    link: shareArr._link,
                    imgUrl: shareArr._imgUrl,
                    success: function () {
                        shareArr._shareTimelineCallback(); 
                    },
                    cancel: function () {

                    }
                });
            });
        },
        formErrorTips: function(alertNodeContext){  //错误提示弹层
            var alertInt;
            clearTimeout(alertInt);
            if($(".alertNode").length > 0){
                $(".alertNode").html(alertNodeContext);
            }else{
                var alertNode = document.createElement("div");
                    alertNode.setAttribute("class","alertNode");
                    alertNode.innerHTML = alertNodeContext;
                    document.body.appendChild(alertNode);

            }
            alertInt = setTimeout(function(){
                $(".alertNode").remove();
            },3000);
        },
        ajaxFun: function(ajaxType, ajaxUrl, ajaxData, ajaxDataType, ajaxCallback){
            $.ajax({
                type: ajaxType,
                url: ajaxUrl,
                data: ajaxData,
                dataType: ajaxDataType
            }).done(function(data){
                ajaxCallback(data)
            })
            
            // ajaxFun("GET", "/weixin/jssdk", jssdkPushData, "json", jssdkCallback);

            // function jssdkCallback(data){
            //     wechatShare(data.appid, data.time, data.noncestr, data.sign);
            // }  
        },
        loadingFnDoing: function(allAmg, loadCallback){
            this.loadFn(allAmg , function (){

                $("img").each(function(){ 
                    $(this).attr("src",$(this).attr("sourcesrc"));
                })
                
                loadCallback();
                // $(".loadingBar").html(p + '%');
                
            } , function (p){
                $(".loadingBar").html(p + '%');
                //$(".loading em").html(p);
                console.log(p);
            });
        },
        overscroll: function(el){
            el.addEventListener('touchstart', function() {
                var top = el.scrollTop
                  , totalScroll = el.scrollHeight
                  , currentScroll = top + el.offsetHeight
                //If we're at the top or the bottom of the containers
                //scroll, push up or down one pixel.
                //
                //this prevents the scroll from "passing through" to
                //the body.
                if(top === 0) {
                  el.scrollTop = 1
                } else if(currentScroll === totalScroll) {
                  el.scrollTop = top - 1
                }
            })
            el.addEventListener('touchmove', function(evt) {
                //if the content is actually scrollable, i.e. the content is long enough
                //that scrolling can occur
                if(el.offsetHeight < el.scrollHeight)
                  evt._isScroller = true
            })
        },
        eventTester: function(m, e, c){
            /*
             * eventTester("play");              // play()和autoplay开始播放时触发
             * eventTester("pause");             // pause() 暂停触发
             * eventTester("timeupdate");        // 播放时间改变
             * eventTester("ended");             // 播放结束
             */
            m.addEventListener(e,function(){
                 c()
            },false);
        }
    }



    // 获取地址栏 key 值 ?id=1
    Common.prototype.GetQueryString = function(key){
        var reg = new RegExp("(^|&)"+ key +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return unescape(r[2]); return null;
    }



	// 页面切换
	function PageRouter(id, callback){
		if(!(this instanceof PageRouter)){
	        var self = new PageRouter(id, callback);
	        self.init();
	        return self;
	    };

	    this.container = null;
	    this.items = null;
	    this.callback = null;

	    this.init = function(){
	    	this.render();
	    	this.exec();
	    }

	    this.render = function(){
	    	var me = this;
	    		me.container = document.getElementById(id);
	    		me.items = document.querySelectorAll('.section');
	    		me.callback = callback;
	    }

	    this.getSelectedItem = function(){
	    	let selected = document.querySelector('.selected');
	        return selected;
	    }

	    this.exec = function(){
	    	let selected = this.getSelectedItem();
            document.body.className = 'page-' + id;
	        if(selected){
	            selected.className = 'section';
	        }
	        let item = this.container;
	        if(item){
	            item.className = 'section selected';
	        }

	        if(this.callback){
	        	this.callback();
	        };
	    }
	}

	Common.prototype.PageRouter = PageRouter;




	// 弹出层
	function Popup(id, content, eventEl){
        if(!(this instanceof Popup)){
            var self = new Popup(id, content, eventEl);
            self.init();
            return self;
        };

        this.setting = {
            id: id,
            el: null,
            closeEl: null,
            eventEl: document.querySelector(eventEl),
            parentEl: document.body,
            content: content,
            popupEl: function(){
                var me = this;
                var el = document.createElement('div');
                    el.className = 'popup hidden';
                    el.id = id;
                    el.innerHTML = `  
                        <div class="popup-con">
                            <div class="close"></div>
                            ${content}
                        </div>
                    `;
                return el;
            }
        };
    }

    Popup.prototype.init = function(){
        this.render();
    }
    Popup.prototype.render = function(){
        var me = this,
            popupId = me.setting.id;
        var popupHTML = me.setting.popupEl();
        me.setting.parentEl.appendChild(popupHTML);

        me.setting.el = document.getElementById(popupId);
        me.setting.closeEl = me.setting.el.querySelector('.close');

        me.bind();
    }
    Popup.prototype.bind = function(){
        var me = this,
            setting_close = me.setting.closeEl;

        setting_close.addEventListener('click', function(){
            me.hide();
        })

        me.setting.eventEl.addEventListener('click', function(){
            me.show();
        })
    }

    Popup.prototype.hide = function(){
        var setting_popupEl = this.setting.el;
        if(setting_popupEl.className.indexOf(' hidden') < 0){
            setting_popupEl.className += ' hidden';
        } 
    }

    Popup.prototype.show = function(){
        var setting_popupEl = this.setting.el;
        if(setting_popupEl.className.indexOf(' hidden') >= 0){
            setting_popupEl.className = setting_popupEl.className.replace(' hidden', '');
        } 
    }

    Common.prototype.Popup = Popup;




	w.Common = Common;




})(window, jQuery);

