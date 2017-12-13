;(function(w){
	function Bgmusic(){
		if(!(this instanceof Bgmusic)){
            var self = new Bgmusic();
            self.init();
            return self;
        };
		this.el = null;
		this.init = function(){
			this.create();
		}
		this.create = function(){
			var em = document.createElement('audio');
			em.src = '/build/dist/media/coachxmas.m4a';
			em.loop = true;
			em.preload = 'auto';
			em.innerHTML = '您的浏览器不支持 audio 标签。';
			this.el = em;
			document.body.appendChild(em);
		}
		this.play = function(){
			this.el.play();
		}
		this.pause = function(){
			this.el.pause();
		}
	}

	var bgMusic = Bgmusic();



	// 总共用时
	function TimeCount(el){
		return {
			data: {
				'el': document.querySelector(el),
				'timer': null,
				'count': 0,
				'minutes': 0,
				'second': 0
			},
			init: function(){
				this.update();
			},
			update: function(){
				var me = this;
				me.data.minutes = me.data.count % 60 + '';
				me.data.second = Math.floor(me.data.count / 60) + '';
				me.data.el.innerHTML = `
					<div class="timePos n${me.data.second < 10 ? '0' : me.data.second[0]}"></div>
	                <div class="timePos n${me.data.second < 10 ? me.data.second : me.data.second[1]}"></div>
	                <div class="timePos n10"></div>
	                <div class="timePos n${me.data.minutes < 10 ? '0' : me.data.minutes[0]}"></div>
	                <div class="timePos n${me.data.minutes < 10 ? me.data.minutes : me.data.minutes[1]}"></div>
				`;
				me.data.count++;
			},
			start: function(){
				var me = this;
				me.data.timer = setInterval(function(){
					me.update();
				}, 1000);
			},
			paused: function(){
				clearInterval(this.data.timer);
			},
			getTime: function(){
				return {
					'second': this.data.second < 10 ? '0' + this.data.second : this.data.second,
					'minutes': this.data.minutes < 10 ? '0' + this.data.minutes : this.data.minutes
				}
			}
		};
	}
	var timeCount = new TimeCount('.timeArea');


	function MagicFun(){
		this.timer = null;         // 定时器
		this.paused = 0;           // 全局状态
		this.countInit = 0;
		this.sceneHover = null;
		this.common = new Common();
		this.status = 0;
	}

	MagicFun.prototype.init = function(){
		this.sceneHover = document.querySelector('.scene-bg.hover');
		this.open();
		timeCount.start();
	}

	MagicFun.prototype.open = function(){
		var me = this;
		if(!me.paused) {
			me.update();
		}
		if(this.status){
			window.cancelAnimationFrame(me.timer); 
			me.timer = null;
		}else{
			me.timer = w.requestAnimationFrame(me.open.bind(me)); 
			var ikonwBtnEl = document.querySelector('.iknow-btn');
			ikonwBtnEl.className = ikonwBtnEl.className.replace(' disabled', '');
		}
		
	}

	MagicFun.prototype.update = function(){
		var me = this;
		var countInit = me.countInit;
		switch(countInit){
			case 2: 
				me.sceneBgChange('.scene1', 0, 'style1');
			break;
			case 500:
				me.sceneBgChange('.scene2', 1, 'style2');
			break;
			case 1000:
				me.sceneBgChange('.scene3', 2, 'style3');
			break;
			case 1500:
				me.sceneBgChange('.scene4', 3, 'style4');
			break;
			case 2000:
				me.status = 1;
				w.removeEventListener('deviceorientation', function(){}, true);
				document.onkeyup = function(evt){}
				elementsObj.paused();
				timeCount.paused();
			    me.countInit = null;
			    me.count();
			default:
				
			break;

		}

		me.countInit ++;
		barriers.doing(countInit);
		star.doing(countInit);
	}


	MagicFun.prototype.cancelStatus = function(){
		w.cancelAnimationFrame(this.timer);
	}

	MagicFun.prototype.sceneBgChange = function(el, k, name){   // 场景背景更换
		var me = this;
		/* Use a custom bezier curve. */
		elementsObj.elDataArrayIndex = k;
		barriers.cname = name;

		var container = document.querySelector(el);
		$(container).transition({
		  opacity: 1,
		  duration: 500,
		  easing: ['cubic-bezier(.42,0,1,1)'],
		  complete: function() {
		  	$(this).addClass('hover');

		  	$(me.sceneHover).transition({
			  opacity: 0,
			  duration: 100,
			  easing: 'out',
			  complete: function() { 
			  	$(this).removeClass('hover');
			  }
			});

		  }
		});
	}




	MagicFun.prototype.count = function(){
		var me = this;
		bgMusic.pause();
		var time = timeCount.getTime();
		var scores = star.eatScores.unique();
		hero.exit();

		document.getElementById('hero').addEventListener("webkitAnimationEnd", function (e) {
			var loading = document.querySelector('.loading');
			loading.className = 'loading';
			loading.style.visibility = 'visible';
			loading.querySelector('p').innerHTML = '目前涌入的小伙伴过多<br>成绩正在计算中，请耐心等待。';


			// me.common.PageRouter('scores');
			// loading.className = 'loading hidden';

			// 提交数据
			var countTime = Math.round(time.second * 60 + (time.minutes * 1) - scores.length * 0.5);
			var randomMillisecond = Math.floor(Math.random() * 1000);

			me.common.fetch.record({
		      'records': (countTime + '.' + randomMillisecond),  
			  'animal': hero.elClassName,
			  'bar': scores.length,
			  'timeinit': (time.second * 60 + time.minutes * 1)
		    }, function(data){
		    	if(data.status === 3){
		    		me.common.base.formErrorTips(data.msg);
		    	}
		    	document.querySelector('.heartCount').innerHTML = scores.length + ' 个';
				document.querySelector('.timeCount').innerHTML = Math.floor(countTime/60) + ' 分 ' + countTime%60 + ' 秒 ' + randomMillisecond;
				me.common.PageRouter('scores');
				loading.className = 'loading hidden';
				loading.style.visibility = 'hidden';
				loading.querySelector('p').innerHTML = '目前涌入的小伙伴过多<br>页面正在跳转中，请耐心等待。';

				// 重绘Share文案
    			shareData['_title'] = '酷玩圣诞，“礼”享不停！';
    			shareData['_desc'] = '这里有一份圣诞惊喜正在等你领取！';
    			shareData['_desc_friend'] = '这里有一份圣诞惊喜正在等你领取！';
				shareData['_link'] = data['share_url'];

				shareData['_shareAppMessageCallback'] = function(){
					me.common.PageRouter('share');
					shareTips.hide();
		        	_hmt.push(['_trackEvent', 'share', 'button', 'onMenuShareAppMessage - result']);
			    }
			    shareData['_shareTimelineCallback'] = function(){
			    	me.common.PageRouter('share');
			    	shareTips.hide();
			        _hmt.push(['_trackEvent', 'share', 'button', 'onMenuShareTimeline - result']);
			    }

			    me.common.base.wxshareFun();

				// console.log(shareData);

		    });
		});

	}





	
	// document.querySelector('.start').onclick = function(){
	// 	paused ? paused = 0 : paused = 1;
	// }

	var ikonwBtn = document.querySelector('.iknow-btn');
	w.magicFun = new MagicFun();

	ikonwBtn.addEventListener('click', function(){
		if(this.className.indexOf(' disabled') >= 0) return false;
		this.className += ' disabled';
		bgMusic.play();

		elementsObj.init();

		timeCount.init();
		hero.init();
		barriers.init();
		star.init();

		magicFun.init();
		$('.gameTips').fadeOut();
	}, false)



})(window);
