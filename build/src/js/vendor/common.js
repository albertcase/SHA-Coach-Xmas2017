// Common.js
;(function(w){
	function Common(){

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

})(window)

