/*-------------------------------------------------------------------------------------*/

window.init_web_sock = _.once(function() {
  connect_websocket();
  keep_trying_to_connect();
});
/*-------------------------------------------------------------------------------------*/
function is_https() {

  var patt = new RegExp("^https:");

  return patt.test(window.location.href);
}
/*-------------------------------------------------------------------------------------*/
function connect_websocket() {

  var scheme = is_https() ? "wss://" : "ws://";

  var uri = settings.web_sock_uri;
  if (uri == null)
    uri = window.document.location.host;
  uri = scheme + uri + "/";

  try {
    window.web_sock = new WebSocket(uri);

    window.web_sock.onmessage = function(message) {

      event = jQuery.parseJSON(message.data);

      console.log(event);
      process_event(event);
    };

    window.web_sock.onopen = function() {
      console.log("websocket connected.");
      //get_current_event_number_request();
      what_did_i_miss_request();
    };

    window.web_sock.onclose = function() {
      console.log("websocket closed");
      keep_trying_to_connect();

    };

    window.web_sock.onerror = function() {
      console.log("websocket error");
      keep_trying_to_connect();
    };
  }
  catch (e) {}

}
/*-------------------------------------------------------------------------------------*/

function keep_trying_to_connect() {

  var interval = 100;
  
  var interval_id = setInterval(function(){

    if (window.web_sock.readyState == WebSocket.CLOSING || window.web_sock.readyState == WebSocket.CLOSED) {
       connect_websocket();
    }
    else {
      clearInterval(interval_id);
    }

  }, interval);
}
/*-------------------------------------------------------------------------------------*///
//http://stackoverflow.com/a/4818541
window.onbeforeunload = function() {
    window.web_sock.onclose = function () {}; // disable onclose handler first
    window.web_sock.close()
};


/*-------------------------------------------------------------------------------------*/
