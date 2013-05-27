$(function(){
	$('[data-position=fixed]').fixedtoolbar({ tapToggle:false});
	
	var timer = 0;
	var direction = 1;
	var spinnerAngle = 0;
	
	function drawBG(){
		/*var bg1Xpos = parseInt($(".bg1").css("background-position-x"));
		var bg2Xpos = parseInt($(".bg2").css("background-position-x"));
		
		if (bg1Xpos >= 0) {
			direction = -1;
		} else if (bg1Xpos <= -36) {
			direction = 1;
		}
		
		if (bg2Xpos >= 0) {
			direction = -1;
		} else if (bg2Xpos <= -36) {
			direction = 1;
		}
		
		var newBg1Pox = bg1Xpos + direction + "px";
		var newBg2Pox = bg2Xpos + direction + "px";
		
		$(".bg1").css("background-position-x", newBg1Pox);
		$(".bg2").css("background-position-x", newBg2Pox);*/
		
		if (timer >= 30 && timer < 95 ) {
			$(".bg2").fadeIn(3000);
			$(".bg1").fadeOut(3000);
		} else if (timer >= 96) {
			$(".bg2").fadeOut(3000);
			$(".bg1").fadeIn(3000);
			timer = 0;
		}
		
		timer++;
		
        //draw again
        setTimeout(function() {
	        bgAnimation(drawBG);
	    }, 1000/6);
    }
    
    function drawSpinner(){
		$(".scanSpinner").css("-webkit-transform", "rotate(" + spinnerAngle + "deg)");
		spinnerAngle = spinnerAngle+3;
		
        setTimeout(function() {
	        spinnerAnimation(drawSpinner);
	    }, 1000/120);
    }

    var bgAnimation = window.webkitRequestAnimationFrame;
    bgAnimation(drawBG);
    
    var spinnerAnimation = window.webkitRequestAnimationFrame;
    spinnerAnimation(drawSpinner);
    
    // button State
    
    $(".footerMenu li").touchstart(function() {
	    $(this).addClass("tap");
    });
    
    $(".footerMenu li").touchend(function() {
	    $(this).removeClass("tap");
    });
    
    $(".scanButtonRound").touchstart(function() {
	    $(".scanSpinner").show();
    });
    
    $(".scanButtonRound").touchend(function() {
    	var fadeOut = setTimeout(function(){
	    	$(".scanSpinner").fadeOut(1000);
	    }, 5000);
    });

});