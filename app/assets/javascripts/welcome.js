// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
/*-------------------------------------------------------------------------------------*/
function display_login_info() {


  if (document.URL.split('?')[0].split('/')[3] == "login")
    return;


  var done_func = function(login) {

    window.login_info = login; 

    var e = document.getElementById("login_info");
    if (e == null) 
      return;

    if (login.is_logged_in) {
      e.innerHTML = "You are logged in as <span style='color:orange;font-weight:bold; '>" 
	+ login.user+ ' </span>  <a href="javascript:do_log_out();">Log out</a>';
    }
    else {
      var data = encodeURIComponent(document.URL);
      //e.innerHTML = "<a href='/login?page=" + data + "'>Log in</a>";
      e.innerHTML = "";
    }
  }
   
  check_login_request(done_func);
  if (window.login_info != undefined)
    done_func(window.login_info); //Run this now too. So user doesn't see delay.

}
/*-------------------------------------------------------------------------------------*/
function do_log_out() {

  /*
  var xmlhttp = get_xmlhttp();

  xmlhttp.open("GET", "/welcome/do_log_out", false);
  xmlhttp.send();
  */

  do_logout_request(display_login_info);
}


/*-----------------------------------------------------------------------*/
function default_functions(xmlhttp) {

  var funcs = _.keys(xmlhttp);
  var func_patt = /^on/;

  for (var i=0; i<funcs.length; i++) {
    if (func_patt.test(funcs[i])) {
      xmlhttp[funcs[i]] = closure (funcs[i]);
    }
  }
}
/*-----------------------------------------------------------------------*/

function closure(str) {

  return function (e) { 
    console.log(str + " function called.");
    console.log(e);
  };
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

  default_functions(xmlhttp);
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
