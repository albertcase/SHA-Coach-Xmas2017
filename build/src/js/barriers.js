// 障碍物
;(function(w){

	var barriersData = [
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

	// 障碍物
	function Barriers(){
		this.parentEl = document.getElementById('scene');
		this.cname = 'style1';
		this.x = 0;
		this.y = 59;
		this.width = null;
		this.height = null;
		this.elements = [];
		this.speed = 6;
		this.hero = null;
	}

	Barriers.prototype.init = function(){ // 创建元素
		this.render();
		var el = document.createElement('div');
			el.className = 'coachPro ' + this.cname;
			el.style.cssText = 'left: '+ this.x +'px; top: '+ this.y +'%';
			this.parentEl.appendChild(el);
			this.width = parseInt(w.getComputedStyle(el).width, 10);
			this.height = parseInt(w.getComputedStyle(el).height, 10);
		return el;
	}
	Barriers.prototype.render = function(){
		this.x = parseInt(w.getComputedStyle(this.parentEl).width, 10);
		this.hero = hero;
	}
	Barriers.prototype.doing = function(countInit){
		var creatEle = null, me = this;

		//for(let i = 0; i < barriersData.length; i++){
			// if(countInit === barriersData[i].key){
			// 	creatEle = me.init();
			// }
			if(countInit%80 === 0){
				creatEle = me.init();
			}
		//}

		if(creatEle){
			me.elements.push(creatEle);
		}

		for(var i = 0; i < me.elements.length; i++){
			me.update(me.elements[i], i);
		}
	}
	Barriers.prototype.update = function(el, key){  // 更新元素位置
		var elLeft = parseInt(el.style.left, 10) - this.speed,
			me = this;
		var pos = {
			x: me.hero.latex + me.hero.x,  // 250
			y: me.hero.latey * -1,       // -0
			heroWidth: Math.floor(me.hero.width * 0.8)
		}

		if(elLeft > (pos.x - pos.heroWidth * 0.6) && elLeft < (pos.x + pos.heroWidth) && me.hero.status === 'paused'){
			me.hero.waitAnimate();
			magicFun.paused = 1;
			elLeft = (pos.x + pos.heroWidth);
			me.hero.el.style.opacity = 0.2;
			me.hero.el.style.transform = 'translateX(-10px)';
		}else{
			me.hero.el.className = me.hero.el.className.replace(' shake', '');
		}


		if(elLeft < -pos.heroWidth){
			el.style.opacity = 0.1;
			el.remove();
			me.elements.splice(key, 1);
			elLeft = null;
		}

		el.style.left = elLeft + 'px';
		
	}

	w.barriers = new Barriers();
	// .doing()

})(window)

