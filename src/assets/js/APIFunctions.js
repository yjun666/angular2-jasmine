(function ($){

	if(typeof $.xcj == "undefined"){
		$.xcj = {};
	}

	if(typeof $.xcj.scorm == "undefined"){
		$.xcj.scorm = {};
	}

	if(typeof $.xcj.scorm.api == "undefined"){
		$.xcj.scorm.api = {};
	}

	if(typeof $.xcj.scorm.api.parame == "undefined"){
		$.xcj.scorm.api.parame = {
			startDate : null,
			exitPageStatus : null,
			iServerStart : 5,
			bLMSresult : "false",
			lessonstatus : null,
			debug : typeof (console) == "undefined" ? null : console
		};
	}

	$.xcj.scorm.api.loadPage = function (){
	    $.xcj.scorm.api.parame.bLMSresult = $.xcj.scorm.wrapper.initialize();
	    $.xcj.scorm.api.parame.lessonstatus = $.xcj.scorm.wrapper.getComplete();
	    $.xcj.scorm.api.parame.iServerStart = $.xcj.scorm.wrapper.getLocation();
	    $.xcj.scorm.api.parame.iServerStart = parseFloat($.xcj.scorm.api.parame.iServerStart);
	    if( isNaN( $.xcj.scorm.api.parame.iServerStart ) ){
			// the student is now attempting the lesson
	    	$.xcj.scorm.api.parame.iServerStart = 0;
	    }
	    $.xcj.scorm.api.parame.exitPageStatus = false;
	    $.xcj.scorm.api.startTimer();	
	    if($.xcj.scorm.api.parame.lessonstatus == "not attempted"){
	    	// the student is now attempting the lesson
	    	$.xcj.scorm.wrapper.setComplete("incomplete");
	    	$.xcj.scorm.api.parame.lessonstatus = "incomplete";
	    }
	    $.xcj.scorm.api.parame.exitPageStatus = false;
	    $.xcj.scorm.api.startTimer();
	}

	$.xcj.scorm.api.computeTime = function(){
		var formattedTime = "00:00:00.0";
		if ($.xcj.scorm.api.parame.startDate != 0){
			var currentDate = new Date().getTime();
			var elapsedSeconds = ( (currentDate - $.xcj.scorm.api.parame.startDate) / 1000 );
			formattedTime = $.xcj.scorm.api.convertTotalSeconds(elapsedSeconds);
		}
		$.xcj.scorm.wrapper.setSessionTime(formattedTime);
	}
	
	$.xcj.scorm.api.doCommit = function (){
		$.xcj.scorm.wrapper.setExit("suspend");
		$.xcj.scorm.api.computeTime();
		$.xcj.scorm.api.parame.exitPageStatus = true;
		var result = $.xcj.scorm.wrapper.commit();
	}

	$.xcj.scorm.api.doBack = function (){
		$.xcj.scorm.wrapper.setExit("suspend");
		$.xcj.scorm.api.computeTime();
		$.xcj.scorm.api.parame.exitPageStatus = true;
		var result = $.xcj.scorm.wrapper.commit();
		result = $.xcj.scorm.wrapper.terminate();
	}

	$.xcj.scorm.api.doContinue = function(status){
		$.xcj.scorm.wrapper.setExit("");
        var mode = $.xcj.scorm.wrapper.getMode();
		if ( mode != "review"  &&  mode != "browse" ){
			$.xcj.scorm.wrapper.setComplete(status);
		}
		$.xcj.scorm.api.computeTime();
		$.xcj.scorm.api.parame.exitPageStatus = true;
		var result;
		result = $.xcj.scorm.wrapper.commit();
		result = $.xcj.scorm.wrapper.terminate();
    }

	$.xcj.scorm.api.doQuit = function (){
		$.xcj.scorm.wrapper.setExit("logout");
        $.xcj.scorm.api.computeTime();
        $.xcj.scorm.api.parame.exitPageStatus = true;
		var result;
        result = $.xcj.scorm.wrapper.commit();
		result = $.xcj.scorm.wrapper.terminate();
    }

    /*******************************************************************************
	 ** The purpose of this function is to handle cases where the current SCO may be 
	 ** unloaded via some user action other than using the navigation controls 
	 ** embedded in the content.   This function will be called every time an SCO
	 ** is unloaded.  If the user has caused the page to be unloaded through the
	 ** preferred SCO control mechanisms, the value of the "exitPageStatus" var
	 ** will be true so we'll just allow the page to be unloaded.   If the value
	 ** of "exitPageStatus" is false, we know the user caused to the page to be
	 ** unloaded through use of some other mechanism... most likely the back
	 ** button on the browser.  We'll handle this situation the same way we 
	 ** would handle a "quit" - as in the user pressing the SCO's quit button.
	 ******************************************************************************
	 **/
	$.xcj.scorm.api.unloadPage = function (){	
	    if ($.xcj.scorm.api.parame.exitPageStatus != true){
	    	$.xcj.scorm.wrapper.setComplete($.xcj.scorm.api.parame.lessonstatus);
	    	$.xcj.scorm.wrapper.setLocation($.xcj.scorm.api.parame.iServerStart);		
			$.xcj.scorm.api.doQuit();
		}
        // NOTE:  don't return anything that resembles a javascript
		// string from this function or IE will take the
		// liberty of displaying a confirm message box.
	}
			
	$.xcj.scorm.api.startTimer = function(){
		$.xcj.scorm.api.parame.startDate = new Date().getTime();
	}
	$.xcj.scorm.api.setProgress = function (progress){
		$.xcj.scorm.wrapper.setProgress(progress);
	}
	$.xcj.scorm.api.setComplete = function (complete){
		$.xcj.scorm.wrapper.setComplete(complete);
	}
	$.xcj.scorm.api.setScore = function (score){
		$.xcj.scorm.wrapper.setScore(score);
	}
	$.xcj.scorm.api.setSuspendData = function (index){
		$.xcj.scorm.wrapper.setSuspendData(index);
	}
	$.xcj.scorm.api.getSuspendData = function (){
		return $.xcj.scorm.wrapper.getSuspendData();
	}
	$.xcj.scorm.api.getComplete = function (){
	   return $.xcj.scorm.wrapper.getValue("cmi.core.lesson_status");
	}
	/*******************************************************************************
	** this function will convert seconds into hours, minutes, and seconds in
	** CMITimespan type format - HHHH:MM:SS.SS (Hours has a max of 4 digits &
	** Min of 2 digits
	*******************************************************************************/
	$.xcj.scorm.api.convertTotalSeconds = function(ts){
	    var sec = (ts % 60);
	    ts -= sec;
	    var tmp = (ts % 3600);  //# of seconds in the total # of minutes
	    ts -= tmp;              //# of seconds in the total # of hours
	    // convert seconds to conform to CMITimespan type (e.g. SS.00)
	    sec = Math.round(sec*100)/100;
	    var strSec = new String(sec);
	    var strWholeSec = strSec;
	    var strFractionSec = "";
	    if (strSec.indexOf(".") != -1){
	        strWholeSec =  strSec.substring(0, strSec.indexOf("."));
	        strFractionSec = strSec.substring(strSec.indexOf(".")+1, strSec.length);
	    }
	    if (strWholeSec.length < 2){
	        strWholeSec = "0" + strWholeSec;
	    }
	    strSec = strWholeSec;
	    /* not append this 
	    if (strFractionSec.length){
	        strSec = strSec+ "." + strFractionSec;
	    }*/
	    if ((ts % 3600) != 0 ){
		    var hour = 0;
	    }else {
	    	var hour = (ts / 3600);
	    }
	    if ( (tmp % 60) != 0 ){
	    	var min = 0;
	    }else{
		    var min = (tmp / 60);
	    }
	    if ((new String(hour)).length < 2){
	    	hour = "0" + hour;
	    }
	    if ((new String(min)).length < 2){
		    min = "0" + min;
	    }
	    var rtnVal = hour + ":" + min + ":" + strSec;   
	    return rtnVal;
	}

	$.xcj.scorm.api.isNumber = function (obj) {
	    if(isEmpty(obj)){
	    	return(false);
	    }
	    var charset="-0123456789";
	    var num = obj.value;
	    for (var i=0;i<num.length;i++) {
	        if (charset.indexOf(num.charAt(i)) == -1){
	        	return(false);
	        }
	    }
	    return(true);
	}
})(jQuery);