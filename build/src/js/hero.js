// you
;(function(w){
	function Hero(){
		this.el = null;
		this.width = null;
		this.height = null;
		this.x = 0;
		this.y = 62;
		this.latex = 0;
		this.latey = 0;
		this.parentEl = document.getElementById('scene');
		this.speed = 20;
		this.keyCode = ['37', '38', '39', '40', '32'];
		this.animators = new AnimationQueue();
		this.status = 'paused';
		this.jump = {
			'count': 0,
			'first': 0,
			'end': 0
		};
		//this.star = null;
		this.common = new Common();
		this.elClassName = null;

		this.isEat = 0;

		this.waitStatus = 0;    // 碰撞之后等待计算时间设定
	}

	Hero.prototype = {
		init: function(){
			this.create();
			this.render();
			this.el.style.cssText = 'left: '+ this.x +'px; top: '+ this.y +'%';
			this.bind();
		},
		render: function(){
			var scenew = parseInt(w.getComputedStyle(this.parentEl).width, 10);
			this.el = document.getElementById('hero');
			this.x = Math.floor(scenew * 0.2);
			//this.star = star;
			this.width = parseInt(w.getComputedStyle(this.el).width, 10);
			this.height = parseInt(w.getComputedStyle(this.el).height, 10);
			// console.log(this.width, this.height);
		},
		create: function(){
			var el = document.createElement('div');
				el.id = 'hero';
				el.className = 'hero ' + this.elClassName;
			this.parentEl.appendChild(el);
		},
		left: function(){
			this.latex -= this.speed;
			this.update();
		},
		right: function(){
			this.latex += this.speed;
			this.update();
		},
		update: function(){
			this.el.style.transform = 'translate('+ this.latex +'px, ' + this.latey + 'px)';
		},
		anim: function(){
			if(this.status === 'play' || this.waitStatus) return;
			this.status = 'play';
			magicFun.paused = 0;
			var me = this;
			barriers.speed = 8;
			var a1 = new Animator(300, function(p){
			    var tx = 170 - 170 * (1-p);
			    me.latey = -tx;
			    // me.latex = -tx;;
			    me.update();
			})

			var a2 = new Animator(500, function(p){
			    var tx = -170 * (1-p);
			    me.latey = tx;
			    me.update();
			})


			me.animators.append(a1, a2, function repeat(){
		        // console.log('complate!');
		        me.status = 'paused';
		        me.isEat = 0;
		        barriers.speed = 6;
		    });
		    me.animators.flush();
		},
		jumpMobile: function(gammaValue){    // 跳的方法

			var me = this;
			me.jump.count++;


			if(me.jump.count == 2){
				me.jump.first = gammaValue;
			}
			
			if(me.jump.count >= 5){
				me.jump.end = gammaValue;
				
				// (first > end)   // 向下翻
				// (end > first)   // 向上翻
				// 取值区间 10 (灵敏度)
				if(me.jump.first > me.jump.end && (me.jump.first - me.jump.end) > 5){
					hero.anim();
				}
				me.jump.count = 0;
				me.jump.first = 0;
				me.jump.end = 0;
			}



			// if(me.jump.count == 1){
			// 	me.jump.first = b;
			// }
			// if(me.jump.count == 27){

			// 	// 元素的状态是否动画中状态，计算间隔时间     // && (me.jump.first > me.jump.end)
			// 	if(hero.status === 'paused' && me.jump.first > 0 && (me.jump.first - me.jump.end) > 5){
			// 		hero.anim();
			// 	};

			// 	me.jump.end = b;
			// 	me.jump.count = 0;
			// }
			
		},
		handleOrientation: function(orientData){
			var me = this;
			var absolute = orientData.absolute;
			var alpha = orientData.alpha;
			var beta = orientData.beta;
			var gamma = Math.floor(orientData.gamma);
				me.jumpMobile(Math.abs(gamma));
		},
		bind: function(){
			var me = this;
			// PC 跳跃事件
			// document.onkeyup = function(evt){
			// 	// if(hero.status === 'play') return;

			//     evt = (evt) ? evt : w.event;
			//     if (evt.keyCode) {
			        
			// 	    if(evt.keyCode == me.keyCode['0']){
			// 	       if(magicFun.paused)return;
			// 	       me.left();
			// 	       console.log('左')
			// 	    }else if(evt.keyCode == me.keyCode['2']){
			// 	       if(magicFun.paused)return;
			// 	   	   console.log('右')
			// 	   	   me.right();
			// 	    }else if(evt.keyCode == me.keyCode['3']){
			// 	   	   console.log('下')
			// 	    }else if(evt.keyCode == me.keyCode['1'] || evt.keyCode == me.keyCode['4']){
			//     		me.anim();
			// 	    }else{

			// 	    }
			// 	}
			// }



			// MOBILE 跳跃事件
			w.addEventListener("deviceorientation", me.handleOrientation.bind(me), true);

		},
		exit: function(){
			this.el.className += ' mvExit';
		},
		waitAnimate: function(){
			var a = 0.2, me = this;
			me.waitStatus = 1;
			function setSta(){	
				if(a >= 0.9){
					me.waitStatus = 0;
					clearTimeout(setIntervalTime);
					me.el.className += ' shake';
				}else{
					a += 0.1;
				}
				var jsA = parseFloat(a).toFixed(1),
					ml = -10 + jsA * 10;
				me.el.style.opacity = jsA;

				me.el.style.transform = 'translateX('+ ml +'px)';
			}
			var setIntervalTime = setInterval(function(){
				setSta();
			}, 60);
		}
	}

	w.hero = new Hero();
})(window);


// w.addEventListener("deviceorientation", handleOrientation, true);
// var timeA = 0,
// 	nowB = 0;;
// function handleOrientation(orientData){
// 	nowB = new Date().getTime();
// 	document.getElementById('result').innerHTML = (nowB - timeA);
// 	if((nowB - timeA) > 1000){

// 		timeA = nowB;

// 		var absolute = orientData.absolute;
// 		var alpha = orientData.alpha;
// 		var beta = orientData.beta;
// 		var gamma = Math.floor(orientData.gamma);
// 		//document.getElementById('result').innerHTML =  (nowB - timeA) + ':' +gamma;
// 	};
	
// 	// if(hero.status === 'paused' && (gamma > 5 && gamma < 18)){
// 	// 	hero.anim();
// 	// };
// }
