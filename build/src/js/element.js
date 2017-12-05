;(function(w){

	var elementsDataJson = [
		{
			'className': ['el-4', 'el-5', 'el-6', 'el-3', 'el-1', 'el-2'],
			'rate': ['0', '90', '80', '180', '50', '100', '167']
		},
		{
			'className': ['el2-1', 'el2-2', 'el2-3', 'el2-4', 'el2-5', 'el2-6'],
			'rate': ['0', '100', '100', '180', '50', '90', '127'],
		},
		{
			'className': ['el3-1', 'el3-2', 'el3-3', 'el3-4', 'el3-5', 'el3-6'],
			'rate': ['0', '90', '80', '150', '180', '50', '167']
		},
		{
			'className': ['el4-1', 'el4-2', 'el4-3', 'el4-4', 'el4-5', 'el4-6'],
			'rate': ['0', '90', '80', '180', '90', '60', '167']
		}
	]

	// 类;
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


	var elements_obj = {
		scene: document.getElementById('scene'),
		sceneWidth: 0,
		sceneHeight: 0,
		timer: null,
		count: 0,
		elements: [],
		parentEl: document.querySelector('.element'),
		abc: 0,
		elDataArrayIndex: 0,
		elDataArray: null,
		speed: 1,
		setTime: 5,
		waitCount: 0,
		initX: -160,
		init: function(){
			this.render();
		},
		render: function(){
			this.sceneWidth = parseInt(w.getComputedStyle(this.scene).width, 10);
			this.sceneHeight = parseInt(w.getComputedStyle(this.scene).height, 10);
			this.update();
		},
		update: function(){
			var me = this;
			me.timer = setInterval(me.loop, me.setTime);
		},
		paused: function(){
			var me = this;
			clearInterval(me.timer);
			me.timer = null;
		},
		draw: function(){
			var me = elements_obj;
			me.parentEl.innerHTML = '';
			for(var i=0;i<me.elements.length;i++){
				var o = me.elements[i];

				// 清理屏幕外的对象
				if(o.x > me.sceneWidth + 180 || o.x < -180){
					me.elements.splice(i,1);
				}else{
					o.draw(me.parentEl);
				}
			}
		},
		loop: function(){
			var me = elements_obj;
			// if(magicFun.paused) return false;
			me.elDataArray = elementsDataJson[me.elDataArrayIndex];
			
			var x = me.initX;
			var rate = (!me.elDataArray['rate'][me.abc] ? 15 : me.elDataArray['rate'][me.abc]);
			// 1/10的对象添加概率

			me.wait(rate, function(){
				if(me.abc > 6){
					me.abc = 0;
					me.count = 0;
				}
				var money = new Money(x, me.speed, me.elDataArray['className'][me.abc]);

				me.elements.push(money);

				me.abc ++;

			});

			for(var i = 0; i < me.elements.length; i++){
				me.elements[i].move();
			}
			
			me.draw();
			
			me.count ++;
		},
		wait: function(v, callback){
			var me = this;
			me.waitCount++;
			if(me.waitCount >= v){
				me.waitCount = 0;
				callback();
			}
		}
	}


	w.elementsObj = elements_obj;
	// 暂停 paused
	// 更新 update


})(window)
