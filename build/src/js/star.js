// 星星star
;(function(w){

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


	function Star(){
		this.parentEl = document.getElementById('scene');
		this.cname = 'style1';
		this.x = 0;
		this.y = 50;
		this.width = 8;
		this.height = 14;
		this.elements = [];
		this.speed = 4;
		// this.isEat = 0;
		// this.c = '';
		this.writeArr = [];
		this.eatScores = 0;
		this.hero = null;
	}

	Star.prototype.init = function(){ // 创建元素
		this.render();
		this.x = parseInt(w.getComputedStyle(this.parentEl).width, 10);
		var el = document.createElement('div');
		el.className = 'heart ' + this.cname;
		el.style = `width: ${this.width}%; height: ${this.height}%; left: ${this.x}px; top: ${this.y}%`;
		// el.innerHTML = this.c;
		this.parentEl.appendChild(el);

		return el;
	}
	Star.prototype.render = function(){
		this.x = parseInt(w.getComputedStyle(this.parentEl).width, 10)/2;
		this.hero = hero;
	}
	Star.prototype.doing = function(count){
		var creatEle = null, me = this;

		if(me.writeArr.indexOf(count) < 0) {
			me.writeArr.push(count);
			var random = Math.floor(Math.random() * 100);
			// for(let i = 0; i < starData.length; i++){
			// 	// if(count === starData[i].key){
			// 	// 	creatEle = me.init(starData[i].style);
			// 	// }
			// 	//console.log(random % 100, me.elements.length);
			// 	if(count % 100 === 0 || random % 100 === 0){
			// 		if(me.elements.length <= 3){
			// 			creatEle = me.init(starData[i].style);
			// 		}
			// 	}
			// }

			if(count % 100 === 0 || random % 100 === 0){
				if(me.elements.length <= 3){
					creatEle = me.init(starData[0].style);
				}
			}
		};
		

		if(creatEle){
			me.elements.push(creatEle);
		}

		for(var i = 0; i < me.elements.length; i++){
			me.update(me.elements[i], i);
			
		}

	}
	Star.prototype.update = function(el, key){  // 更新元素位置

		var elLeft = parseInt(el.style.left, 10) - this.speed,
			elTop = parseInt(el.style.top, 10),
			me = this;

		var pos = {
			x: me.hero.latex + me.hero.x,  // 250
			y: me.hero.latey * -1,       // -0
			heroWidth: Math.floor(me.hero.width * 0.8)
		}
		if((elLeft + pos.heroWidth) > pos.x && elLeft < (pos.x + pos.heroWidth) && (me.hero.y - pos.y) < me.y){

			if(!me.hero.isEat){
				me.eatScores++;
				console.log(me.eatScores);
				// count -= 20; 
				// console.log('me.hero.isEat');
			};
			me.hero.isEat = 1;
			el.style.opacity = 0.1;
			el.remove();
			elLeft = null;
		}

		if(elLeft < -pos.heroWidth){
			el.remove();
			me.elements.splice(key, 1);
			elLeft = null;
		}

		el.style.left = elLeft + 'px';
	}


	window.star = new Star();
	star.init();
	// star.doing()

})(window)