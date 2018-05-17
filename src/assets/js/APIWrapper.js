/*******************************************************************************
**
** Advanced Distributed Learning Co-Laboratory (ADL Co-Lab) grants you
** ("Licensee") a non-exclusive, royalty free, license to use and redistribute
** this software in source and binary code form, provided that i) this copyright
** notice and license appear on all copies of the software; and ii) Licensee
** does not utilize the software in a manner which is disparaging to ADL Co-Lab.
**
** This software is provided "AS IS," without a warranty of any kind.  ALL
** EXPRESS OR IMPLIED CONDITIONS, REPRESENTATIONS AND WARRANTIES, INCLUDING ANY
** IMPLIED WARRANTY OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE OR
** NON-INFRINGEMENT, ARE HEREBY EXCLUDED.  ADL Co-Lab AND ITS LICENSORS SHALL
** NOT BE LIABLE FOR ANY DAMAGES SUFFERED BY LICENSEE AS A RESULT OF USING,
** MODIFYING OR DISTRIBUTING THE SOFTWARE OR ITS DERIVATIVES.  IN NO EVENT WILL
** ADL Co-Lab OR ITS LICENSORS BE LIABLE FOR ANY LOST REVENUE, PROFIT OR DATA,
** OR FOR DIRECT, INDIRECT, SPECIAL, CONSEQUENTIAL, INCIDENTAL OR PUNITIVE
** DAMAGES, HOWEVER CAUSED AND REGARDLESS OF THE THEORY OF LIABILITY, ARISING
** OUT OF THE USE OF OR INABILITY TO USE SOFTWARE, EVEN IF ADL Co-Lab HAS BEEN
** ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
**
*******************************************************************************/

/*******************************************************************************
**
** This file is being presented to Content Developers, Content Programmers and
** Instructional Designers to demonstrate one way to abstract API calls from the
** actual content to allow for uniformity and reuse of content fragments.
**
** The purpose in wrapping the calls to the API is to (1) provide a
** consistent means of finding the LMS API adapter within the window
** hierarchy, (2) to ensure that the method calls are called correctly by the
** SCO and (3) to make possible changes to the actual API Specifications and
** Standards easier to implement/change quickly.
**
** This is just one possible example for implementing the API guidelines for
** runtime communication between an LMS and executable content components.
** There are many other possible implementations.
**
*******************************************************************************/

(function ($){

	if(typeof $.xcj == "undefined"){
		$.xcj = {};
	}

	if(typeof $.xcj.scorm == "undefined"){
		$.xcj.scorm = {};
	}

	if(typeof $.xcj.scorm.wrapper == "undefined"){
		$.xcj.scorm.wrapper = {};
	}

	if(typeof $.xcj.scorm.wrapper.parame == "undefined"){
		$.xcj.scorm.wrapper.parame = {
			API : null,
			version : null,
			apiHandle : null,
			findAPITries : 0,
			noAPIFound : "false",
			terminated : "false",
			debug : typeof (console) == "undefined" ? null : console
		};
	}

	/*******************************************************************************
	 **
	 ** This function looks for an object named API in parent and opener windows
	 **
	 ** Inputs:  Object - The Window Object
	 **
	 ** Return:  Object - If the API object is found, it's returned, otherwise null
	 **          is returned
	 **
	 ******************************************************************************/
    $.xcj.scorm.wrapper.findAPI = function ( win ){
        while(win.API == null && win.API_1484_11 == null && (win.parent != null) && (win.parent != win) ){
		    $.xcj.scorm.wrapper.parame.findAPITries++;
	        if ($.xcj.scorm.wrapper.parame.findAPITries > 500 ){
	            if ($.xcj.scorm.wrapper.parame.debug){
	        		// $.xcj.scorm.wrapper.parame.debug.log("Error finding API -- too deeply nested.");
	        	}
	            return null;
	        }
	        win = win.parent;
	    }
	    if($.xcj.scorm.wrapper.parame.version){
	        switch($.xcj.scorm.wrapper.parame.version){
	            case "2004" :
	                if(win.API_1484_11){
	                	$.xcj.scorm.wrapper.parame.API = win.API_1484_11;
	                } else {
	                	if ($.xcj.scorm.wrapper.parame.debug){
	    	        		// $.xcj.scorm.wrapper.parame.debug.log("$.xcj.scorm.wrapper.findAPI: SCORM version 2004 was specified by user, but API_1484_11 cannot be found.");
	    	        	}
	                }
	                break;
	            case "1.2" :
	                if(win.API){
	                	$.xcj.scorm.wrapper.parame.API = win.API;
	                } else {
	                	if ($.xcj.scorm.wrapper.parame.debug){
	    	        		// $.xcj.scorm.wrapper.parame.debug.log("$.xcj.scorm.wrapper.findAPI: SCORM version 1.2 was specified by user, but API cannot be found.");
	    	        	}
	                }
	                break;
	        }
	    } else {
	        if(win.API_1484_11) {
	        	$.xcj.scorm.wrapper.parame.API = win.API_1484_11;
	        	$.xcj.scorm.wrapper.parame.version = "2004";
	        } else if(win.API){
	            $.xcj.scorm.wrapper.parame.API = win.API;
	        	$.xcj.scorm.wrapper.parame.version = "1.2";
	        }
	    }
	    if($.xcj.scorm.wrapper.parame.API){
        	if ($.xcj.scorm.wrapper.parame.debug){
        		// $.xcj.scorm.wrapper.parame.debug.log("$.xcj.scorm.wrapper.findAPI: API found. Version: " + $.xcj.scorm.wrapper.parame.version);
        	}
	    } else {
        	if ($.xcj.scorm.wrapper.parame.debug){
        		// $.xcj.scorm.wrapper.parame.debug.log("$.xcj.scorm.wrapper.findAPI: Error finding API. \nFind attempts: 500. \nFind attempt limit: " + $.xcj.scorm.wrapper.parame.findAPITries);
        	}
	    }
	    return $.xcj.scorm.wrapper.parame.API;
    }

	/*******************************************************************************
	 **
	 ** This function looks for an object named API, first in the current window's
	 ** frame hierarchy and then, if necessary, in the current window's opener window
	 ** hierarchy (if there is an opener window).
	 **
	 ** Inputs:  none
	 **
	 ** Return:  Object - If the API object is found, it's returned, otherwise null
	 **                   is returned
	 **
	 ******************************************************************************/
    $.xcj.scorm.wrapper.getAPI = function(){
	    var theAPI = $.xcj.scorm.wrapper.findAPI( window );
	    if ( (theAPI == null) && (window.opener != null) && (typeof(window.opener) != "undefined") ){
	        theAPI = $.xcj.scorm.wrapper.findAPI( window.opener );
	    }
	    if (theAPI == null){
	    	if ($.xcj.scorm.wrapper.parame.debug){
        		// $.xcj.scorm.wrapper.parame.debug.log("Unable to locate the LMS's API Implementation.\nCommunication with the LMS will not occur.");
        	}
	        $.xcj.scorm.wrapper.parame.noAPIFound = "true";
	    }
	    return theAPI;
	}

	/*******************************************************************************
	 **
	 ** Returns the handle to API object if it was previously set, otherwise it
	 ** returns null
	 **
	 ** Inputs:  None
	 **
	 ** Return:  Object - The value contained by the apiHandle variable.
	 **
	 ******************************************************************************/
    $.xcj.scorm.wrapper.getAPIHandle = function (){
	   if ($.xcj.scorm.wrapper.parame.apiHandle == null ){
	      if ($.xcj.scorm.wrapper.parame.noAPIFound == "false" ){
	    	  $.xcj.scorm.wrapper.parame.apiHandle = $.xcj.scorm.wrapper.getAPI();
	      }
	   }
	   return $.xcj.scorm.wrapper.parame.apiHandle;
	}

	/*******************************************************************************
	 **
	 ** This function is used to tell the LMS to initiate the communication session.
	 **
	 ** Inputs:  None
	 **
	 ** Return:  String - "true" if the initialization was successful, or
	 **          "false" if the initialization failed.
	 **
	 ******************************************************************************/
    $.xcj.scorm.wrapper.initialize = function (){
    	var result = "false";
    	var api = $.xcj.scorm.wrapper.getAPIHandle();
    	if(api){
            switch($.xcj.scorm.wrapper.parame.version){
                case "1.2" : result = api.LMSInitialize(""); break;
                case "2004": result = api.Initialize(""); break;
            }
	        if (result != "true" ){
	            $.xcj.scorm.wrapper.displayErrorInfo($.xcj.scorm.wrapper.getLastError());
	        }
        }else {
        	if ($.xcj.scorm.wrapper.parame.debug){
        		// $.xcj.scorm.wrapper.parame.debug.log("$.xcj.scorm.wrapper.initialize failed: API is null.");
        	}
        }
        return result;
	}

	/*******************************************************************************
	 **
	 ** This function is used to tell the LMS to terminate the communication session
	 **
	 ** Inputs:  None
	 **
	 ** Return:  String - "true" if successful or
	 **                   "false" if failed.
	 **
	 ******************************************************************************/
    $.xcj.scorm.wrapper.terminate = function(){
    	var result = "false";
	    if ($.xcj.scorm.wrapper.parame.terminated != "true"){
	    	var api = $.xcj.scorm.wrapper.getAPIHandle();
	        if(api){
	            switch($.xcj.scorm.wrapper.parame.version){
	                case "1.2" : result = api.LMSFinish(""); break;
	                case "2004": result = api.Terminate(""); break;
	            }
		        if (result != "true" ){
		            $.xcj.scorm.wrapper.displayErrorInfo($.xcj.scorm.wrapper.getLastError());
		        }else{
		        	//$.xcj.scorm.wrapper.parame.terminated = "true";
		        }
	        }else {
	        	if ($.xcj.scorm.wrapper.parame.debug){
	        		// $.xcj.scorm.wrapper.parame.debug.log("$.xcj.scorm.wrapper.getValue failed: API is null.");
	        	}
	        }
	    }
        return result;
    }

	/*******************************************************************************
	 **
	 ** This function requests information from the LMS.
	 **
	 ** Inputs:  String - Name of the data model defined category or element
	 **                   (e.g. cmi.core.learner_id)
	 **
	 ** Return:  String - The value presently assigned to the specified data model
	 **                   element.
	 **
	 ******************************************************************************/
	$.xcj.scorm.wrapper.getValue = function(name){
		var result = "";
	    if ($.xcj.scorm.wrapper.parame.terminated != "true"){
	    	var api = $.xcj.scorm.wrapper.getAPIHandle();
	        if(api){
	            switch($.xcj.scorm.wrapper.parame.version){
	                case "1.2" : result = api.LMSGetValue(name); break;
	                case "2004": result = api.GetValue(name); break;
	            }
		        if (result != "" ){
		            $.xcj.scorm.wrapper.displayErrorInfo($.xcj.scorm.wrapper.getLastError());
		        }
	        }else {
	        	if ($.xcj.scorm.wrapper.parame.debug){
	        		// $.xcj.scorm.wrapper.parame.debug.log("$.xcj.scorm.wrapper.getValue failed: API is null.");
	        	}
	        }
	    }
        return result;
	}

	/*******************************************************************************
	 **
	 ** 获取完成状态
	 **
	 ******************************************************************************/
	$.xcj.scorm.wrapper.getComplete = function(){
		var result = "";
	    if ($.xcj.scorm.wrapper.parame.terminated != "true"){
	    	var api = $.xcj.scorm.wrapper.getAPIHandle();
	        if(api){
	            switch($.xcj.scorm.wrapper.parame.version){
	                case "1.2" : result = api.LMSGetValue("cmi.core.lesson_status"); break;
	                case "2004": result = api.GetValue("cmi.completion_status"); break;
	            }
		        if (result != "" ){
		            $.xcj.scorm.wrapper.displayErrorInfo($.xcj.scorm.wrapper.getLastError());
		        }
	        }else {
	        	if ($.xcj.scorm.wrapper.parame.debug){
	        		// $.xcj.scorm.wrapper.parame.debug.log("$.xcj.scorm.wrapper.getComplete failed: API is null.");
	        	}
	        }
	    }
        return result;
	}
	/*******************************************************************************
	 **
	 ** 获取断点续播
	 **
	 ******************************************************************************/
	$.xcj.scorm.wrapper.getSuspendData = function(){
		var result = "false";
	    if ($.xcj.scorm.wrapper.parame.terminated != "true"){
	    	var api = $.xcj.scorm.wrapper.getAPIHandle();
	        if(api){
	            switch($.xcj.scorm.wrapper.parame.version){
	              case "1.2" : result = api.LMSGetValue("cmi.suspend_data"); break;
	                case "2004": result = api.GetValue("cmi.suspend_data"); break;
	            }
				// console.log(result);
		        if (result != "true" ){
		            $.xcj.scorm.wrapper.displayErrorInfo($.xcj.scorm.wrapper.getLastError());
		        }
	        }else {
	        	if ($.xcj.scorm.wrapper.parame.debug){
	        		// $.xcj.scorm.wrapper.parame.debug.log("$.xcj.scorm.wrapper.getSuspendData failed: API is null.");
	        	}
	        }
	    }
        return result;
	}
	/*******************************************************************************
	 **
	 ** 获取当前内容对象的位置
	 **
	 ******************************************************************************/
	$.xcj.scorm.wrapper.getLocation = function(){
		var result = "";
	    if ($.xcj.scorm.wrapper.parame.terminated != "true"){
	    	var api = $.xcj.scorm.wrapper.getAPIHandle();
	        if(api){
	            switch($.xcj.scorm.wrapper.parame.version){
	                case "1.2" : result = api.LMSGetValue("cmi.core.lesson_location"); break;
	                case "2004": result = api.GetValue("cmi.location"); break;
	            }
		        if (result != "" ){
		            $.xcj.scorm.wrapper.displayErrorInfo($.xcj.scorm.wrapper.getLastError());
		        }
	        }else {
	        	if ($.xcj.scorm.wrapper.parame.debug){
	        		// $.xcj.scorm.wrapper.parame.debug.log("$.xcj.scorm.wrapper.getLocation failed: API is null.");
	        	}
	        }
	    }
        return result;
	}

	/*******************************************************************************
	 **
	 ** 设置当前内容对象的位置
	 **
	 ******************************************************************************/
	$.xcj.scorm.wrapper.setLocation = function(value){
		var result = "false";
	    if ($.xcj.scorm.wrapper.parame.terminated != "true"){
	    	var api = $.xcj.scorm.wrapper.getAPIHandle();
	        if(api){
	            switch($.xcj.scorm.wrapper.parame.version){
	                case "1.2" : result = api.LMSSetValue("cmi.core.lesson_location",value); break;
	                case "2004": result = api.SetValue("cmi.location",value); break;
	            }
		        if (result != "true" ){
		            $.xcj.scorm.wrapper.displayErrorInfo($.xcj.scorm.wrapper.getLastError());
		        }
	        }else {
	        	if ($.xcj.scorm.wrapper.parame.debug){
	        		// $.xcj.scorm.wrapper.parame.debug.log("$.xcj.scorm.wrapper.setLocation failed: API is null.");
	        	}
	        }
	    }
        return result;
	}

	/*******************************************************************************
	 **
	 ** 获取内容对象学习状态
	 **
	 ******************************************************************************/
	$.xcj.scorm.wrapper.getMode = function(){
		var result = "";
	    if ($.xcj.scorm.wrapper.parame.terminated != "true"){
	    	var api = $.xcj.scorm.wrapper.getAPIHandle();
	        if(api){
	            switch($.xcj.scorm.wrapper.parame.version){
	                case "1.2" : result = api.LMSGetValue("cmi.core.lesson_mode"); break;
	                case "2004": result = api.GetValue("cmi.mode"); break;
	            }
		        if (result != "" ){
		            $.xcj.scorm.wrapper.displayErrorInfo($.xcj.scorm.wrapper.getLastError());
		        }
	        }else {
	        	if ($.xcj.scorm.wrapper.parame.debug){
	        		// $.xcj.scorm.wrapper.parame.debug.log("$.xcj.scorm.wrapper.getMode failed: API is null.");
	        	}
	        }
	    }
        return result;
	}
	/*******************************************************************************
	 **
	 ** 设置完成状态
	 ** 如果是scorm1.2lesson_status状态为：browsed/passed/failed/not attempted/completed/incomplete
	 ** 如果是scorm2004success_status状态为：browsed/passed/failed
	 ** 如果是scorm2004completion_status状态为：not attempted/completed/incomplete
	 **
	 ******************************************************************************/
	$.xcj.scorm.wrapper.setComplete = function(value){
		var result = "false";
	    if ($.xcj.scorm.wrapper.parame.terminated != "true"){
	    	var api = $.xcj.scorm.wrapper.getAPIHandle();
	        if(api){
	            switch($.xcj.scorm.wrapper.parame.version){
	                case "1.2" : 
	                	result = api.LMSSetValue("cmi.core.lesson_status",value);
	                	break;
	                case "2004": 
	                	if(value == "browsed" || value == "passed" || value == "failed"){
	                		result = api.SetValue("cmi.success_status",value);
	                	}else if(value == "not attempted" || value == "completed" || value == "incomplete"){
	                		result = api.SetValue("cmi.completion_status",value);
	                	}
	                	break;
	            }
		        if (result != "true" ){
		            $.xcj.scorm.wrapper.displayErrorInfo($.xcj.scorm.wrapper.getLastError());
		        }
	        }else {
	        	if ($.xcj.scorm.wrapper.parame.debug){
	        		// $.xcj.scorm.wrapper.parame.debug.log("$.xcj.scorm.wrapper.setComplete failed: API is null.");
	        	}
	        }
	    }
        return result;
	}

	/*******************************************************************************
	 **
	 ** 设置分数:raw当前分数,max最大分数,min最低分数
	 ** 如果当前分数大于最大分数,设置最大分数为当前分数
	 ** 如果当前分数小于最低分数,设置最低分数为当前分数
	 **
	 ******************************************************************************/
	$.xcj.scorm.wrapper.setScore = function(value){
		var result = "false";
	    if ($.xcj.scorm.wrapper.parame.terminated != "true"){
	    	var api = $.xcj.scorm.wrapper.getAPIHandle();
	        if(api){
	            switch($.xcj.scorm.wrapper.parame.version){
	                case "1.2" : 
	                	result = api.LMSSetValue("cmi.core.score.raw",value);
	                	if (result == "true" ){
	                		var max = api.LMSGetValue("cmi.core.score.max");
		                	if(value > max){
		                		api.LMSSetValue("cmi.core.score.max",value);
		                	}
		                	var min = api.LMSGetValue("cmi.core.score.min");
		                	if(value < min){
		                		api.LMSSetValue("cmi.core.score.min",value);
		                	}
	                	}
	                	break;
	                case "2004": 
	                	result = api.SetValue("cmi.score.raw",value);
	                	if (result == "true" ){
	                		var max = api.LMSGetValue("cmi.score.max");
		                	if(value > max){
		                		api.LMSSetValue("cmi.score.max",value);
		                	}
		                	var min = api.LMSGetValue("cmi.score.min");
		                	if(value < min){
		                		api.LMSSetValue("cmi.score.min",value);
		                	}
	                	}
	                	break;
	            }
		        if (result != "true" ){
		            $.xcj.scorm.wrapper.displayErrorInfo($.xcj.scorm.wrapper.getLastError());
		        }
	        }else {
	        	if ($.xcj.scorm.wrapper.parame.debug){
	        		// $.xcj.scorm.wrapper.parame.debug.log("$.xcj.scorm.wrapper.setScore failed: API is null.");
	        	}
	        }
	    }
        return result;
	}

	/*******************************************************************************
	 **
	 ** 设置学习时间
	 **
	 ******************************************************************************/
	$.xcj.scorm.wrapper.setSessionTime = function(value){
		var result = "false";
	    if ($.xcj.scorm.wrapper.parame.terminated != "true"){
	    	var api = $.xcj.scorm.wrapper.getAPIHandle();
	        if(api){
	            switch($.xcj.scorm.wrapper.parame.version){
	                case "1.2" : result = api.LMSSetValue("cmi.core.session_time",value); break;
	                case "2004": result = api.SetValue("cmi.session_time",value); break;
	            }
		        if (result != "true" ){
		            $.xcj.scorm.wrapper.displayErrorInfo($.xcj.scorm.wrapper.getLastError());
		        }
	        }else {
	        	if ($.xcj.scorm.wrapper.parame.debug){
	        		// $.xcj.scorm.wrapper.parame.debug.log("$.xcj.scorm.wrapper.setSessionTime failed: API is null.");
	        	}
	        }
	    }
        return result;
	}

	/*******************************************************************************
	 **
	 ** 设置进度
	 **
	 ******************************************************************************/
	$.xcj.scorm.wrapper.setProgress = function(value){
		var result = "false";
	    if ($.xcj.scorm.wrapper.parame.terminated != "true"){
	    	var api = $.xcj.scorm.wrapper.getAPIHandle();
	        if(api){
	            switch($.xcj.scorm.wrapper.parame.version){
	              case "1.2" : result = api.LMSSetValue("cmi.core.lesson_progress",value); break;
	                case "2004": result = api.SetValue("cmi.lesson_progress",value); break;
	            }
		        if (result != "true" ){
		            $.xcj.scorm.wrapper.displayErrorInfo($.xcj.scorm.wrapper.getLastError());
		        }
	        }else {
	        	if ($.xcj.scorm.wrapper.parame.debug){
	        		// $.xcj.scorm.wrapper.parame.debug.log("$.xcj.scorm.wrapper.setProgress failed: API is null.");
	        	}
	        }
	    }
        return result;
	}
	/*******************************************************************************
	 **
	 ** 存储断点续播
	 **
	 ******************************************************************************/
	$.xcj.scorm.wrapper.setSuspendData = function(value){
		var result = "false";
	    if ($.xcj.scorm.wrapper.parame.terminated != "true"){
	    	var api = $.xcj.scorm.wrapper.getAPIHandle();
	        if(api){
	            switch($.xcj.scorm.wrapper.parame.version){
	              case "1.2" : result = api.LMSSetValue("cmi.suspend_data",value); break;
	                case "2004": result = api.SetValue("cmi.suspend_data",value); break;
	            }
		        if (result != "true" ){
		            $.xcj.scorm.wrapper.displayErrorInfo($.xcj.scorm.wrapper.getLastError());
		        }
	        }else {
	        	if ($.xcj.scorm.wrapper.parame.debug){
	        		// $.xcj.scorm.wrapper.parame.debug.log("$.xcj.scorm.wrapper.setSuspendData failed: API is null.");
	        	}
	        }
	    }
        return result;
	}
	/*******************************************************************************
	 **
	 ** 退出(状态:time-out/suspend/logout/空)
	 **
	 ******************************************************************************/
	$.xcj.scorm.wrapper.setExit = function(value){
		var result = "false";
	    if ($.xcj.scorm.wrapper.parame.terminated != "true"){
	    	var api = $.xcj.scorm.wrapper.getAPIHandle();
	        if(api){
	            switch($.xcj.scorm.wrapper.parame.version){
	                case "1.2" : result = api.LMSSetValue("cmi.core.exit",value); break;
	                case "2004": result = api.SetValue("cmi.exit",value); break;
	            }
		        if (result != "true" ){
		            $.xcj.scorm.wrapper.displayErrorInfo($.xcj.scorm.wrapper.getLastError());
		        }
	        }else {
	        	if ($.xcj.scorm.wrapper.parame.debug){
	        		// $.xcj.scorm.wrapper.parame.debug.log("$.xcj.scorm.wrapper.setExit failed: API is null.");
	        	}
	        }
	    }
        return result;
	}

	/*******************************************************************************
	 **
	 ** This function is used to tell the LMS to assign the value to the named data
	 ** model element.
	 **
	 ** Inputs:  String - Name of the data model defined category or element value
	 **
	 **          String - The value that the named element or category will be
	 **                   assigned
	 **
	 ** Return:  String - "true" if successful or
	 **                   "false" if failed.
	 **
	 ******************************************************************************/
	$.xcj.scorm.wrapper.setValue = function(name, value){
		var result = "false";
	    if ($.xcj.scorm.wrapper.parame.terminated != "true"){
	    	var api = $.xcj.scorm.wrapper.getAPIHandle();
	        if(api){
	            switch($.xcj.scorm.wrapper.parame.version){
	                case "1.2" : result = api.LMSSetValue(name, value); break;
	                case "2004": result = api.SetValue(name, value); break;
	            }
		        if (result != "true" ){
		            $.xcj.scorm.wrapper.displayErrorInfo($.xcj.scorm.wrapper.getLastError());
		        }
	        }else {
	        	if ($.xcj.scorm.wrapper.parame.debug){
	        		// $.xcj.scorm.wrapper.parame.debug.log("$.xcj.scorm.wrapper.setValue failed: API is null.");
	        	}
	        }
	    }
        return result;
	}

    /*******************************************************************************
	 **
	 ** This function requests that the LMS persist all data to this point in the
	 ** session.
	 **
	 ** Inputs:  None
	 **
	 ** Return:  None
	 **
	 *******************************************************************************/
	$.xcj.scorm.wrapper.commit = function(){
	    var result = "false";
	    if ($.xcj.scorm.wrapper.parame.terminated != "true"){
	    	var api = $.xcj.scorm.wrapper.getAPIHandle();
	        if(api){
	            switch($.xcj.scorm.wrapper.parame.version){
	                case "1.2" : result = api.LMSCommit(""); break;
	                case "2004": result = api.Commit(""); break;
	            }
	        }else {
	        	if ($.xcj.scorm.wrapper.parame.debug){
	        		// $.xcj.scorm.wrapper.parame.debug.log("$.xcj.scorm.wrapper.commit failed: API is null.");
	        	}
	        }
	    }
        return result;
	}

	/*******************************************************************************
	 **
	 ** This function requests the error code for the current error state from the
	 ** LMS.
	 **
	 ** Inputs:  None
	 **
	 ** Return:  String - The last error code.
	 **
	 ******************************************************************************/
	$.xcj.scorm.wrapper.getLastError = function (){
        var code = "";
        var api = $.xcj.scorm.wrapper.getAPIHandle();
        if(api){
            switch($.xcj.scorm.wrapper.parame.version){
                case "1.2" : code = api.LMSGetLastError(); break;
                case "2004": code = api.GetLastError(); break;
            }
        }else {
        	if ($.xcj.scorm.wrapper.parame.debug){
        		// $.xcj.scorm.wrapper.parame.debug.log("$.xcj.scorm.wrapper.getLastError failed: API is null.");
        	}
        }
        return code;
	}

	/*******************************************************************************
	 **
	 ** This function requests a textual description of the current error state from
	 ** the LMS
	 **
	 ** Inputs:  String - The error code.
	 **
	 ** Return:  String - Textual description of the given error state.
	 **
	 ******************************************************************************/
	$.xcj.scorm.wrapper.getErrorString = function (errCode){
	    var code = "";
	    var api = $.xcj.scorm.wrapper.getAPIHandle();
        if(api){
            switch($.xcj.scorm.wrapper.parame.version){
                case "1.2" : code = api.LMSGetErrorString(errCode); break;
                case "2004": code = api.GetErrorString(errCode); break;
            }
        }else {
    	    if ($.xcj.scorm.wrapper.parame.debug){
    		    // $.xcj.scorm.wrapper.parame.debug.log("$.xcj.scorm.wrapper.getErrorString failed: API is null."); 
    	    }
        }
        return code;
	}

	/*******************************************************************************
	 **
	 ** This function requests additional diagnostic information about the given
	 ** error code.  This information is LMS specific, but can help a developer find
	 ** errors in the SCO.
	 **
	 ** Inputs:  String - The error code.
	 **
	 ** Return:  String - Additional diagnostic information about the given error
	 **                   code
	 **
	 ******************************************************************************/
    $.xcj.scorm.wrapper.getDiagnostic = function(errCode){
	    var code = "";
	    var api = $.xcj.scorm.wrapper.getAPIHandle();
        if(api){
            switch($.xcj.scorm.wrapper.parame.version){
                case "1.2" : code = api.LMSGetDiagnostic(errCode); break;
                case "2004": code = api.GetDiagnostic(errCode); break;
            }
        }else {
    	    if ($.xcj.scorm.wrapper.parame.debug){
        	    // $.xcj.scorm.wrapper.parame.debug.log("$.xcj.scorm.wrapper.getDiagnostic failed: API is null.");
    	    }
        }
        return code;
	}

	/*******************************************************************************
	 **
	 ** Display the last error code, error description and diagnostic information.
	 **
	 ** Inputs:  String - The error code
	 **
	 ** Return:  None
	 **
	 ******************************************************************************/
	$.xcj.scorm.wrapper.displayErrorInfo = function (errCode){
	    if ($.xcj.scorm.wrapper.parame.debug){
	        var errString = $.xcj.scorm.wrapper.getErrorString( errCode );
	        var errDiagnostic = $.xcj.scorm.wrapper.getDiagnostic( errCode );
	        // $.xcj.scorm.wrapper.parame.debug.log( "ERROR: " + errCode + " - " + errString + "\n" + "DIAGNOSTIC: " + errDiagnostic );
	    }
	}
})(jQuery);

