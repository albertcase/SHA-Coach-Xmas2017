;(function(w, $){

	// 成绩榜
    var toplistJson = {
        'list': [
            {
                'name': 'a',
                'socurs': '1分20秒'
            },
            {
                'name': 'b',
                'socurs': '1分20秒'
            },
            {
                'name': 'c',
                'socurs': '1分20秒'
            },
            {
                'name': 'd',
                'socurs': '1分20秒'
            },
            {
                'name': 'e',
                'socurs': '1分20秒'
            },
            {
                'name': 'f',
                'socurs': '1分20秒'
            }
        ],
        'userinfo': {
            'socurs': '1分23秒',
            'ranking': '121'
        }
    };

    fetch.authorize({}, function(data){
        console.log(data);
    });

    function Toplist(listEl, userinfoEl){
        this.setting = {
            'data': toplistJson,
            'listEl': document.querySelector(listEl),
            'userinfoEl': document.querySelector(userinfoEl)
        }
        this.init = function(){
            this.update();
        }
    }

    Toplist.prototype.update = function(){
        var me = this;
        var userinfo = me.setting.data.userinfo;
        var list = me.setting.data.list;

        var listArray = [], userinfoHTML = '';
        for(let i = 0; i < list.length; i++){
            listArray.push(`<li><span>${list[i].name}</span><span>${list[i].socurs}</span></li>`);
        }

        userinfoHTML = `
            <div class="socurs">${userinfo.socurs}</div>
            <div class="ranking">${userinfo.ranking}名</div>
        `;

        me.setting.listEl.innerHTML = listArray.join('');
        me.setting.userinfoEl.innerHTML = userinfoHTML;
    }

    var toplist = new Toplist('.toplist-table ul', '.toplist-userinfo');



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
			case 800:
				me.sceneBgChange('.scene2', 1, 'style2');
			break;
			case 1600:
				me.sceneBgChange('.scene3', 2, 'style3');
			break;
			case 2400:
				me.sceneBgChange('.scene4', 3, 'style4');
			break;
			case 3200:
				me.status = 1;
				w.removeEventListener('deviceorientation', function(){}, true);
				me.common.PageRouter('scores');
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
		console.log(fetch);

		var time = timeCount.getTime();
		var scores = star.eatScores.unique();

		// 提交数据
		fetch.record({
	      'records': time,
		  'animal': me.common.GetQueryString('id'),
		  'bar': 2
	    }, function(){

	    });

		document.querySelector('.heartCount').innerHTML = scores.length + ' 个';
		document.querySelector('.timeCount').innerHTML = time.second + ' 分 ' + time.minutes + ' 秒';
		toplist.init();
		
	}





	
	// document.querySelector('.start').onclick = function(){
	// 	paused ? paused = 0 : paused = 1;
	// }

	var ikonwBtn = document.querySelector('.iknow-btn');
	w.magicFun = new MagicFun();

	ikonwBtn.addEventListener('click', function(){
		var bgMusic = document.getElementById('bgMusic');
		bgMusic.play();

		elementsObj.init();

		timeCount.init();
		hero.init();
		barriers.init();
		star.init();

		$('.gameTips').hide();

		magicFun.init();
	}, false)





})(window, jQuery);
