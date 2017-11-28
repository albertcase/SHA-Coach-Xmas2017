;(function(w){


	function Animator(duration, update, easing){
	    this.duration = duration;
	    this.update = update;
	    this.easing = easing;
	}

	Animator.prototype = {
	    /**
	     * @param options = {begin, update, end}
	     */
	     req: null,
	     start: function(options){
	        options = options || {};

	        var startTime = Date.now(),
	            duration = this.duration,
	            update = this.update,
	            easing = this.easing,
	            begin = options.begin,
	            end = options.end,
	            self = this;

	        if(begin){
	            begin.call(this);
	        }

	        function step(){
	            var p = (Date.now() - startTime) / duration;

	            if(p < 1.0){
	                update.call(self, easing ? easing(p) : p, p);
	                self.req = requestAnimationFrame(step);
	            }else{
	                var loop = false;

	                if(typeof end === 'function'){
	                    loop = end.call(self) === false;  // loop if end return false
	                }else{
	                    loop = end === false;  // shorthand for end: function(){return false}
	                }


	                if(!loop){
	                    update.call(self, easing ? easing(1.0) : 1.0, 1.0)
	                }else{
	                    p -= 1.0;
	                    startTime += duration;
	                    step(easing ? easing(p) : p, p)
	                }
	            }
	        }
	        self.req = requestAnimationFrame(step);
	     },
	     pause: function(){
	        window.cancelAnimationFrame(this.req); 
	     }
	}



	function AnimationQueue(animators){
	    this.animators = animators || [];
	}

	AnimationQueue.prototype = {
	    append: function(){
	        var args = [].slice.call(arguments);
	        this.animators.push.apply(this.animators, args);
	    },
	    flush: function(){
	        if(this.animators.length){
	            var self = this;

	            function play(){
	                var animator = self.animators.shift();

	                if(animator instanceof Animator){
	                    animator.start({
	                        end: function(){
	                            if(self.animators.length){
	                                play();
	                            }
	                        }
	                    })
	                }else{ // if not animator, just call it
	                    animator.call(self);
	                    if(self.animators.length){
	                        play();
	                    }
	                }
	 
	            }
	            play();
	        }
	    }
	}





	var timer = null, count = 0, paused = 0, countInit = 0;
	var scene = document.getElementById('scene');
	var gemeTime = document.querySelector('.timeArea');
	var sceneWidth = parseInt(window.getComputedStyle(scene).width, 10);
	var sceneHeight = parseInt(window.getComputedStyle(scene).height, 10);

	var obstacleData = [
		{
			key: 1,
			style: 'style1'
		},{
			key: 80,
			style: 'style2'
		},{
			key: 190,
			style: 'style3'
		},{
			key: 270,
			style: 'style1'
		},{
			key: 320,
			style: 'style2'
		},{
			key: 450,
			style: 'style1'
		},{
			key: 500,
			style: 'style3'
		}
	];

	var starData = [
		{
			key: 2,
			style: ''
		},{
			key: 56,
			style: 'style2'
		},{
			key: 150,
			style: 'style3'
		},{
			key: 220,
			style: ''
		},{
			key: 300,
			style: 'style2'
		},{
			key: 410,
			style: 'style1'
		},{
			key: 500,
			style: 'style3'
		}
	];




	// you
	function Hero(pEl){
		this.el = document.getElementById('hero');
		this.width = 13;
		this.height = 20;
		this.x = sceneWidth / 2;
		this.y = 70;
		this.latex = 0;
		this.latey = 0;
		this.parentEl = pEl;
		this.speed = 20;
		this.keyCode = ['37', '38', '39', '40', '32'];
		this.animators = new AnimationQueue();
		this.status = 'paused';
	}

	Hero.prototype = {
		init: function(){
			this.el.style = `width: ${this.width}%; height: ${this.height}%; left: ${this.x}px; top: ${this.y}%;`;
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
			if(this.status === 'play') return;
			this.status = 'play';
			paused = 0; 
			var me = this;
			var a1 = new Animator(300, function(p){
			    var tx = 160 - 160 * (1-p);
			    me.latey = -tx;
			    // me.latex = -tx;;
			    me.update();
			})

			var a2 = new Animator(400, function(p){
			    var tx = -160 * (1-p);
			    me.latey = tx;
			    me.update();
			})


			me.animators.append(a1, a2, function repeat(){
		        // console.log('complate!');
		        me.status = 'paused';
		        star.isEat = 0;
		    });
		    me.animators.flush();
		}
	}

	var hero = new Hero(scene);
	hero.init();

	
	// 跳跃事件
	var keyCode = ['37', '38', '39', '40', '32'];
	document.onkeyup = function(evt){
		if(hero.status === 'play') return;

	    evt = (evt) ? evt : window.event;
	    if (evt.keyCode) {
	        
		    if(evt.keyCode == keyCode['0']){
		       //do something
		       if(paused)return;
		       hero.left();
		       console.log('左')
		    }else if(evt.keyCode == keyCode['2']){
		       if(paused)return;
		   	   console.log('右')
		   	   hero.right();
		    }else if(evt.keyCode == keyCode['3']){
		   	   console.log('下')
		    }else if(evt.keyCode == keyCode['1'] || evt.keyCode == keyCode['4']){
	    		hero.anim();
		    }else{

		    }
		}
	}




		var jumpCount = 0, jumpFirst = 0, jumpEnd = 0;
		function jump(b){
		    jumpCount++;
			if(jumpCount > 6) {
				if(hero.status === 'paused' && (jumpFirst - jumpEnd) >= 4){
					hero.anim();
				};
				jumpCount = 0;
			};
			
			if(jumpCount == 1){
				jumpFirst = b;
			}
			if(jumpCount == 6){
				jumpEnd = b;
			}
		}

		// var int = setInterval("start()",50)








		window.addEventListener("deviceorientation", handleOrientation, true);

		function handleOrientation(orientData){
			var absolute = orientData.absolute;
			var alpha = orientData.alpha;
			var beta = orientData.beta;
			var gamma = Math.floor(orientData.gamma);
			jump(gamma);
		}








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







	// 障碍物
	function CreateEl(el){
		this.parentEl = el;
		this.cname = 'style1';
		this.x = sceneWidth;
		this.y = 70;
		this.width = 10;
		this.height = 20;
		this.elements = [];
		this.speed = 5;
	}

	CreateEl.prototype.init = function(elStyle){ // 创建元素
		var el = document.createElement('div');
		el.className = 'coachPro ' + (elStyle ? elStyle : this.cname);
		// el.innerHTML = this.c;
		el.style = `width: ${this.width}%; height: ${this.height}%; left: ${this.x}px; top: ${this.y}%`;
		this.parentEl.appendChild(el);
		return el;
	}
	CreateEl.prototype.doing = function(count, countInit){
		var creatEle, me = this;

		for(let i = 0; i < obstacleData.length; i++){
			if(countInit === obstacleData[i].key){
				creatEle = me.init(obstacleData[i].style);
			}
		}

		if(creatEle){
			me.elements.push(creatEle);
		}

		for(var i = 0; i < me.elements.length; i++){
			me.update(me.elements[i]);
		}
	}
	CreateEl.prototype.update = function(el){  // 更新元素位置
		var elLeft = parseInt(el.style.left, 10) - this.speed,
			me = this;


		var pos = {
			x: hero.latex + hero.x,  // 250
			y: hero.latey * -1       // -0
		}
		if(elLeft > (pos.x - 80) && elLeft < (pos.x + 80) && hero.status === 'paused'){
			paused = 1;
			elLeft = (pos.x + 80);
			el.className += ' shake';
		}else{
			el.className = el.className.replace(' shake', '');
		}


		if(elLeft < -80){
			// el.style.opacity = 0.5;
			el.remove();
			elLeft = null;
		}

		el.style.left = elLeft + 'px';
		
	}


	// w.CreateEl = CreateEl;


	// 星星star
	function Star(el){
		this.parentEl = el;
		this.cname = 'style1';
		this.x = sceneWidth;
		this.y = 50;
		this.width = 8;
		this.height = 14;
		this.elements = [];
		this.speed = 2;
		this.isEat = 0;
		// this.c = '';
		this.writeArr = [];
		this.eatScores = 0;
	}

	Star.prototype.init = function(elStyle){ // 创建元素
		var el = document.createElement('div');
		el.className = 'heart ' + (elStyle ? elStyle : this.cname);
		el.style = `width: ${this.width}%; height: ${this.height}%; left: ${this.x}px; top: ${this.y}%`;
		// el.innerHTML = this.c;
		this.parentEl.appendChild(el);
		return el;
	}
	Star.prototype.doing = function(count){
		var creatEle = null, me = this;

		if(me.writeArr.indexOf(count) < 0) {
			me.writeArr.push(count);

			for(let i = 0; i < starData.length; i++){
				if(count === starData[i].key){
					creatEle = me.init(starData[i].style);
				}
			}
		};
		

		if(creatEle){
			me.elements.push(creatEle);
		}

		for(var i = 0; i < me.elements.length; i++){
			me.update(me.elements[i]);
		}
	}
	Star.prototype.update = function(el){  // 更新元素位置
		var elLeft = parseInt(el.style.left, 10) - this.speed,
			elTop = parseInt(el.style.top, 10),
			me = this;


		var pos = {
			x: hero.latex + hero.x,  // 250
			y: hero.latey * -1       // -0
		}

		if((elLeft + 50/2) > pos.x && elLeft < (pos.x + 80/2) && (hero.y - pos.y) < me.y){

			if(!me.isEat){
				me.eatScores++;
				// console.log(me.eatScores);
				// count -= 20; 
				// console.log('isEat');
			};
			me.isEat = 1;
			el.style.opacity = 0.1;
			el.remove();
			elLeft = null;
		}


		if(elLeft < -50){
			// el.style.opacity = 0.1;
			el.remove();
			elLeft = null;
		}

		el.style.left = elLeft + 'px';
		
	}




	// 总共用时
	function GemeTime(el){
		this.element = el;
		this.minutes = 0;   // 分
		this.second = 0;    // 秒
		this.time = [];
		this.init = function(){
			this.update();
		}
		this.update = function(c){
			var curCountNum = c ? c : 0;

			// if(paused){
			// 	count += 10;
			// 	c += 10;
			// }
			if(curCountNum % 100 === 0 || paused || star.isEat){
				this.minutes = Math.floor(curCountNum / 100) + '';
			}
			this.second = curCountNum % 100 + '';
			// console.log(this.minutes, this.second);
			// this.time = [(this.minutes < 10 ? '0' + this.minutes : this.minutes)+'', ':', (this.second < 10 ? '0' + this.second : this.second)+''];
			// console.log(this.time);

			this.element.innerHTML = `
				<div class="timePos n${this.minutes < 10 ? '0' : this.minutes[0]}"></div>
                <div class="timePos n${this.minutes < 10 ? this.minutes[0] : this.minutes[1]}"></div>
                <div class="timePos n10"></div>
                <div class="timePos n${this.second < 10 ? '0' : this.second[0]}"></div>
                <div class="timePos n${this.second < 10 ? this.second[0] : this.second[1]}"></div>
			`;
		}
	}

	
	
	var createEl = new CreateEl(scene);    // 障碍物
	var star = new Star(scene);
	var gt = new GemeTime(gemeTime);

	gt.init();

	function start(){
		console.log(countInit);
		if(countInit === 200){
			sceneBgChange('.scene2');
		}else if(countInit === 400){
			sceneBgChange('.scene3');
		}else if(countInit === 600){
			sceneBgChange('.scene4');
		}else if(countInit === 1){
			sceneBgChange('.scene1');
		}else{

		}
		if(countInit >= 1200){
			countInit = 0;
			// w.removeEventListener('deviceorientation',handleOrientation, true);
			// document.querySelector('.gameover').style.visibility = 'visible';
			// window.cancelAnimationFrame(timer); 
		 //    timer = null;
		 //    countInit = null;
		 //    return;
		}

		count ++;
		if(!paused) {
			countInit ++;
			createEl.doing(count, countInit);
		}

		star.doing(count);
		gt.update(count);
		timer = window.requestAnimationFrame(start); 
		 
	}
	

	
	// document.querySelector('.start').onclick = function(){
	// 	paused ? paused = 0 : paused = 1;
	// }


	// 背景更换
	function sceneBgChange(el){

		var prvHover = $(".scene-bg.hover");
		
		/* Use a custom bezier curve. */
		$(el).transition({
		  opacity: 1,
		  duration: 600,
		  easing: ['cubic-bezier(.42,0,1,1)'],
		  complete: function() {
		  	$(this).addClass('hover');

		  	prvHover.transition({
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
	
	



	$(".gameTips a.iknow-btn").on('click', function(){
		start();
		sceneBgChange('.scene1');
		$('.gameTips').hide();
	})






})(window);
