if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
    }, false);
}

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

	w.AnimationQueue = AnimationQueue;
	w.Animator = Animator;

})(window)
