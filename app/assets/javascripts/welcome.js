// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
/*-------------------------------------------------------------------------------------*/
$(document).on('page:change', function () {
  display_login_info();
     });

/*-------------------------------------------------------------------------------------*/
function display_login_info() {

  var e = document.getElementById("login_info");
  if (e == null) 
    return;

 
  var info = get_login_info();

  if (info.is_logged_in) {
      e.innerHTML = "You are logged in as <span style='color:orange;font-weight:bold; '>" 
	+ info.user+ ' </span>  <a href="javascript:do_log_out();">Log out</a>';
  }
  else
    e.innerHTML = "<a href='/login'>Log in</a>";
}
/*-------------------------------------------------------------------------------------*/
function do_log_out() {

 var xmlhttp = get_xmlhttp();

 xmlhttp.open("GET", "/welcome/do_log_out", false);
 xmlhttp.send();

 display_login_info();
}

/*-------------------------------------------------------------------------------------*/
function get_xmlhttp() {

  var xmlhttp;
  if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp=new XMLHttpRequest();
  }
  else
  {// code for IE6, IE5
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }

  return xmlhttp;
}

/*-------------------------------------------------------------------------------------*/
function get_json(url) {

 var xmlhttp = get_xmlhttp();

 xmlhttp.open("GET", url, false);
 xmlhttp.send();

 return jQuery.parseJSON(xmlhttp.responseText);
}

/*-------------------------------------------------------------------------------------*/
function get_login_info() {

 return get_json("/welcome/check_login");
}
/*-------------------------------------------------------------------------------------*/
