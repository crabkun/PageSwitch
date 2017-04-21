$(function(){
			pagecount=$('.page').length;
			current=0;
			playing=false;
			$('.page').removeClass("page-current");
			$($('.page')[0]).addClass("page-current");
			$('.navlist').children().removeClass("current");
			$($('.navlist').children()[0]).addClass("current");
			for(r=0;r<pagecount;r++){
				if($($('.page')[r]).attr("InAnimatedNext")==null)$($('.page')[r]).attr("InAnimatedNext","slideInUp");
				if($($('.page')[r]).attr("InAnimatedPrev")==null)$($('.page')[r]).attr("InAnimatedPrev","slideInDown");
				if($($('.page')[r]).attr("OutAnimatedNext")==null)$($('.page')[r]).attr("OutAnimatedNext","slideOutUp");
				if($($('.page')[r]).attr("OutAnimatedPrev")==null)$($('.page')[r]).attr("OutAnimatedPrev","slideOutDown");
			}
			if($('body').mousewheel!=null)
				$('body').mousewheel(function(event, delta, deltaX, deltaY) {
					if(delta>0)
						showPage(current-1);
					else
						showPage(current+1);
				});
			if($("body").swipe!=null)
				$("body").swipe( {
					swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
					  if(direction=="up")
						showPage(current+1);
					  else (direction=="down")
						showPage(current-1);
					}
				  });
			$('.navlist').children().click(function(e){showPage($(e.toElement).attr("page")-1)});
			function playAnimated(target,InOut,which){
				var tmp
				if(InOut=="in")
					tmp=(which>0?target.attr("InAnimatedNext"):target.attr("InAnimatedPrev"))
				else
					tmp=(which>0?target.attr("OutAnimatedNext"):target.attr("OutAnimatedPrev"))
				target.addClass("animated "+tmp)
			}
			function EndAnimated(target){
				tmp=target.attr("InAnimatedNext")+" "+target.attr("OutAnimatedNext")+" "+target.attr("InAnimatedPrev")+" "+target.attr("OutAnimatedPrev")
				target.removeClass("animated "+tmp)
			}
			function showPage(page){
				if(playing) return;
				if(page==current)return;
				playing=true;
				oldtarget=current;
				which=page>current?1:-1;
				current=page;
				if(current>pagecount-1)
					current=0;
				else if(current<0)
					current=pagecount-1;
				$('.navlist').children().removeClass("current");
				$($('.navlist').children()[current]).addClass("current");
				playAnimated($($('.page')[oldtarget]),"out",which)
				playAnimated($($('.page')[current]),"in",which)
				$($('.page')[current]).addClass("page-current")
			}
			function whichTransitionEvent(){
				var t;
				var el = document.createElement('fakeelement');
				var transitions = {
				  'webkitAnimation':'webkitAnimationEnd',
				  'animation':'animationend',
				}
				for(t in transitions){
					if( el.style[t] !== undefined ){
						return transitions[t];
					}
				}
			}
			for(i=0;i<pagecount;i++){
				var transitionEvent = whichTransitionEvent();
				$($('.page')[i]).bind(transitionEvent, function(a) {
					if(!$(a.target).hasClass("page")) return;
					$('.page').removeClass("page-current")
					$($('.page')[current]).addClass("page-current")
					EndAnimated($(this))
					playing=false;
				});
			}
}); 