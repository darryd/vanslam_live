// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

/*-------------------------------------------------------------------------------------*/
$(window).load(function() {
  display_login_info();
});

/*-------------------------------------------------------------------------------------*/

$( document ).ready(function() {
  display_login_info();
});


/*-------------------------------------------------------------------------------------*/
function display_login_info() {

  var e = document.getElementById("login_info");
  if (e == null) 
    return;

 
  info = get_login_info();

  if (info.is_logged_in) {
    e.innerHTML = "You are logged in as " + info.user + " <a href='/welcome/do_log_out'>Log out</a>";
  }
  else
    e.innerHTML = "<a href='/login'>Log in</a>";
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
function get_login_info() {

 var xmlhttp = get_xmlhttp();

 xmlhttp.open("GET", "/welcome/check_login", false);
 xmlhttp.send();

 return jQuery.parseJSON(xmlhttp.responseText);
}
/*-------------------------------------------------------------------------------------*/
