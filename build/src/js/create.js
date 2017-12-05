;(function(w, $){
	var bgMusic = document.getElementById('bgMusic');

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
				me.data.minutes = me.data.count%60 + '';
				me.data.second = Math.floor(me.data.count/60) + '';
				me.data.el.innerHTML = `
					<div class="timePos n${me.data.second < 10 ? '0' : me.data.second[0]}"></div>
	                <div class="timePos n${me.data.second < 10 ? me.data.second : me.data.second[1]}"></div>
	                <div class="timePos n10"></div>
	                <div class="timePos n${me.data.minutes < 10 ? '0' : me.data.minutes[0]}"></div>
	                <div class="timePos n${me.data.minutes < 10 ? me.data.minutes : me.data.minutes[1]}"></div>
				`
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


			me.common.PageRouter('scores');
			loading.className = 'loading hidden';

			// 提交数据
			// fetch.record({
		 //      'records': (time.second * 60 + time.minutes + '.' + Math.floor(Math.random() * 1000)),
			//   'animal': hero.elClassName,
			//   'bar': scores.length
		 //    }, function(){
		 //    	document.querySelector('.heartCount').innerHTML = scores.length + ' 个';
			// 	document.querySelector('.timeCount').innerHTML = time.second + ' 分 ' + time.minutes + ' 秒';
			// 	me.common.PageRouter('scores');
			// 	loading.className = 'loading hidden';
		 //    });
		});

	}





	
	// document.querySelector('.start').onclick = function(){
	// 	paused ? paused = 0 : paused = 1;
	// }

	var ikonwBtn = document.querySelector('.iknow-btn');
	w.magicFun = new MagicFun();

	ikonwBtn.addEventListener('click', function(){
		bgMusic.play();

		elementsObj.init();

		timeCount.init();
		hero.init();
		barriers.init();
		star.init();

		magicFun.init();
		$('.gameTips').fadeOut();
	}, false)





})(window, jQuery);
