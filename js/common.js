/**
 * Swaps divs to show.
 * @param no
 */
function showDiv(no) {
	
	$('.divContent').hide();	
	$('.dialog').hide();

	$('.linkDivSelected').addClass('linkDiv');
	$('.linkDiv').removeClass('linkDivSelected');	
	$('#Link_Right_' + no).addClass('linkDivSelected');	
	
	if (no == 2) {
		fetchAjax('../html/faq.html',no);
	} else if (no == 3) {
		fetchAjax('../html/rules.html',no);
	} else if (no == 4) {
		fetchAjax('../html/products.html',no);
	} else if (no == 5) {
		fetchAjax('../html/mechanics.html',no);
	}
	else {	
		//no ajax in this case, just show div directly
		$('#divContent_' + no).toggle();
	}
	
}
function displayFAQ() {
	Popup('../html/faq.html','FAQ',570,760);
}


function displayRules() {
	Popup('../html/rules.html','RULES',570,760);
}


function displayPrivacy() {
	Popup('../html/privacy.html','Privacy Policy',570,760);
}

function displayEula() {
	Popup('../html/eula.html','EULA',570,760);
}



function displayProducts() {
	document.location.href = 'http://www.vuelatazos.com/productos.html';
}



function displayMechanics() {
	document.location.href = 'http://www.vuelatazos.com/mecanica.html';
}

function displayWinners() {
	Popup('../html/winners.html','EULA',570,760);
}


/**
 * Displays a popup window
 * @param url
 * @param name
 * @param height
 * @param width
 */
function Popup(url, name, height, width) {
	var iMyWidth;
	var iMyHeight;
	//half the screen width minus half the new window width (plus 5 pixel borders).
	iMyWidth = (screen.width/2)- width/2;
	//half the screen height minus half the new window height (plus title and status bars).
	iMyHeight = (screen.height/2) -height/2;
	
	window.open( url, '', 'status=1,height=' + height + ',width=' + width +',left=' + iMyWidth + ',top=' + iMyHeight + ',screenX=' + iMyWidth + ',screenY=' + iMyHeight + ',resizable=0,scrollbars=1');
}
/*
function ShowDivAsDialog(no) {
	
	if (no == 2) {
		fetchAjax('../html/faq.html',no, true);
	} else if (no == 3) {
		fetchAjax('../html/rules.html',no, true);
	} else if (no == 4) {
		fetchAjax('../html/products.html',no, true);
	} else if (no == 5) {
		fetchAjax('../html/mechanics.html',no, true);
	}
	
	
}
*/


/**
 * Request to fetch an url and display the content of it 
 * in the specified div.
 * @param urlToFetch
 * @param no
 * @param popup Displays as a popup
 */
function fetchAjax(urlToFetch,no, popup) {
	
	$.ajax({
		  url: urlToFetch,
		  context: document.body,
		  success: function(data){		    	
			  //if (popup != true) {				  			  
				  $('#divContent_' + no).html(data);
				  $('#divContent_' + no).toggle();
//			  } else {
//				  ShowDialogWindow('',data,320, 300, 'center', true)
//			  }
		  }
		});
	
}


/**
 * Displays a dialog with specified caption, text, width and height, ok button, cancel button, close button
 */

function ShowDialogWindow(caption, text, width, height, alignment, showOkButton) {	
	$("#overlay").show();
	$("#dialogWindow").html('');
	$("#dialogWindow").css('width', width + 'px');
	$("#dialogWindow").css('height', height + 'px');
	$("#dialogWindow").css('margin', 'auto');	
	$("#dialogWindow").css('margin-left', eval((520-width)/2) + 'px');
	$("#dialogWindow").css('margin-top', eval((900/2) -height ) + 'px');	
	$("#dialogWindow").css('text-align', alignment);
	
	$("#dialogWindow").html('<input type=\'button\' id=\'btnCloseFormWindow\' class=\'btnCloseFormHoverOff\' style=\'margin-left:' + (width-20) + 'px; margin-top:-24px;\'/><div id=\'divCaption\' style=\'font-size: 14px; \' >' + caption + '</div><div id=\'text\'>' + text + '</div>');
	$("#text").css('height', (height - 80) + 'px');
	$("#text").css('display', 'table-cell');
	$("#text").css('vertical-align', 'middle');
	
	
	
	if (showOkButton) {
		$("#text").append("<br/><input type=\'button\' id=\'btnOK\' class=\'btnOKHoverOff\'/>");
		
		$("#btnOK").click(function(e) {								
			$("#overlay").hide();
			$("#dialogWindow").hide();
			e.preventDefault();
		});
		
		$("#btnOK").css('position','relative');
		$("#btnOK").css('margin-top','20px');
		//$("#btnOK").css('margin-left', eval((520-width)/2)  + 'px');
		
		$("#btnOK").mousedown(function(e) {
			$('#btnOK').removeClass('btnOKHoverOff');
			$('#btnOK').removeClass('btnOKHoverOn');
			$('#btnOK').addClass('btnOKActive');
		});
		$("#btnOK").mouseover(function(e) {
			$('#btnOK').removeClass('btnOKActive');
			$('#btnOK').removeClass('btnOKHoverOff');
			$('#btnOK').addClass('btnOKHoverOn');
		});
		$("#btnOK").mouseout(function(e) {
			$('#btnOK').removeClass('btnOKActive');
			$('#btnOK').removeClass('btnOKHoverOn');
			$('#btnOK').addClass('btnOKHoverOff');
		});
	}
	$("#btnCloseFormWindow").click(function(e) {
		$("#overlay").hide();
		$("#dialogWindow").hide();
		e.preventDefault();		
	});

	$("#btnCloseFormWindow").mousedown(function(e) {
		$('#btnCloseFormWindow').removeClass('btnCloseFormHoverOn');
		$('#btnCloseFormWindow').removeClass('btnCloseFormHoverOff');
		$('#btnCloseFormWindow').addClass('btnCloseFormActive');
	});
	
	
	$("#btnCloseFormWindow").mouseover(function(e) {
		$('#btnCloseFormWindow').removeClass('btnCloseFormActive');
		$('#btnCloseFormWindow').removeClass('btnCloseFormHoverOff');
		$('#btnCloseFormWindow').addClass('btnCloseFormHoverOn');
	});
	
	$("#btnCloseFormWindow").mouseout(function(e) {
		$('#btnCloseFormWindow').removeClass('btnCloseFormActive');
		$('#btnCloseFormWindow').removeClass('btnCloseFormHoverOn');
		$('#btnCloseFormWindow').addClass('btnCloseFormHoverOff');
	});
		
	$("#dialogWindow").show();
}

function loadNavigationButtons() {
	
	setEventsForButton('btnLink1');
	setEventsForButton('btnLink2');
	setEventsForButton('btnLink3');
	setEventsForButton('btnLink4');
	setEventsForButton('btnLink5');
	setEventsForButton('btnLink6');
	
}

function setEventsForButton(btnLink) {
	var btnName = '#' + btnLink;
	$(btnName).mousedown(function(e) {				
		$(btnName).removeClass(btnLink + 'HoverOff');
		$(btnName).removeClass(btnLink + 'HoverOn');
		$(btnName).addClass(btnLink + 'Active');
	});
	$(btnName).mouseover(function(e) {				
		$(btnName).removeClass(btnLink + 'Active');
		$(btnName).removeClass(btnLink + 'HoverOff');
		$(btnName).addClass(btnLink + 'HoverOn');
	});
	$(btnName).mouseout(function(e) {				
		$(btnName).removeClass(btnLink + 'Active');
		$(btnName).removeClass(btnLink + 'HoverOn');
		$(btnName).addClass(btnLink + 'HoverOff');
	});
	
}

/* Checks if the Browser is IE. Resturns true if IE*/
function isIE() {
  return /msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent);
}

/*
 * Returns true if Mac, false otherwise
 */
function isMac() {	
	return navigator.appVersion.indexOf("Mac")!=-1;
}

function isFF() {
	return navigator.userAgent.toLowerCase().indexOf("firefox")!=-1;
}
function isAndroid() {
	return navigator.userAgent.toLowerCase().indexOf("android")!=-1;
}
function isIphone() {
	return navigator.userAgent.toLowerCase().indexOf("iphone")!=-1;
}

function isMobile() {	
	if (isAndroid() ||isIphone() ) {
		return true;
	} else {
		return false;
	}
}
