;(function($){

	var timer = null;
	var scene = document.getElementById('scene');
	var sceneWidth = parseInt($(scene).css('width'), 10);
	var sceneHeight = parseInt($(scene).css('height'), 10);
	// 金币类;
	function Money(x, speed, cn){
		// 没次循环增加的像素数
		this.speed = (speed === 0 ? 6 : speed);
		this.x = x;
		this.className = cn;
	}
	Money.prototype = {
		draw:function(parentEl){
			var el = document.createElement('div');
			el.className = 'el ' + this.className;
			el.style.left = this.x + 'px';
			// el.innerHTML = v;
			parentEl.appendChild(el);
		},
		move:function(){
			this.x += this.speed;
		}
	}


	var App = {
		count: 0,
		elements: [],
		parentEl: document.querySelector('.element'),
		abc: 0,
		rate: 15,
		draw: function(){
			var me = App;
			me.parentEl.innerHTML = '';
			for(var i=0;i<me.elements.length;i++){
				var o = me.elements[i];

				// 清理屏幕外的对象
				if(o.x > sceneWidth + 180 || o.x < -180){
					me.elements.splice(i,1);
				}else{
					o.draw(me.parentEl);
				}
			}
		},
		loop: function(){
			var me = App;
			var elClassArr = ['el-4', 'el-5', 'el-6', 'el-3', 'el-1', 'el-2'];
			
			for(var i=0;i<me.elements.length;i++){
				me.elements[i].move();
			}

			//var chance = Math.floor(Math.random() * 1000);

			var x = -180;
			var speed = 5;


			if(me.abc === 0){
				me.rate = 16;
			}else if(me.abc === 1){
				me.rate = 22;
			}else if(me.abc === 2){
				me.rate = 40;
			}else if(me.abc === 3){
				me.rate = 84;
			}else if(me.abc === 4){
				me.rate = 34;
			}else if(me.abc === 5){
				me.rate = 42;
			}else{

			};


			// 1/10的对象添加概率
			if(me.count%me.rate === 0){
				if(me.abc >= 6){
					me.abc = 0;
					me.count = 0;
				}
				var money = new Money(x, speed, elClassArr[me.abc]);
				if(me.elements.length < 7){
					me.elements.push(money);
				};
				me.abc ++;
			}
			
			me.draw();
			
			me.count ++;
		}
	}

	timer = setInterval(App.loop, 70);


})(jQuery)
