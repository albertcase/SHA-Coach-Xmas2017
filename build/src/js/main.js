;(function(w){

	function ShareTips(el){
		return {
			init: function(){
				var me = this;
				me.render();
			},
			datas: {
				el: null,
				close: null
			},
			render: function(){
				var me = this;
				me.datas.el = $(el);
				me.datas.close = $(el).find('.close');
				me.bind();
			},
			bind: function(){
				var me = this;
				me.datas.close.on('click', function(){
					me.hide();
				})
			},
			show: function(){
				this.datas.el.removeClass('hidden');
			},
			hide: function(){
				this.datas.el.addClass('hidden');
			}
		}
	}

	// 分享提示层
	w.shareTips = new ShareTips('.shareTips');
	shareTips.init();

})(window)