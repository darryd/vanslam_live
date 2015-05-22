/*-------------------------------------------------------------------------------------*/

window.init_web_sock = _.once(function() {
  connect_websocket();
  keep_trying_to_connect();
});
/*-------------------------------------------------------------------------------------*/

function connect_websocket() {

  var scheme = "wss://";
  var uri = scheme + window.document.location.host + "/";

  try {
    window.web_sock = new WebSocket(uri);

    window.web_sock.onmessage = function(message) {
      console.log(message);

    };

    window.web_sock.onopen = function() {
      console.log("websocket connected.");

    };

    window.web_sock.onclose = function() {
      keep_trying_to_connect();

    };

    window.web_sock.onerror = function() {
      keep_trying_to_connect();
    };
  }
  catch (e) {}

}
/*-------------------------------------------------------------------------------------*/

function keep_trying_to_connect() {

  var interval = 100;

  window.interval_id = setInterval(function(){

    if (window.web_sock.readyState == WebSocket.CLOSING || window.web_sock.readyState == WebSocket.CLOSED) {
       connect_websocket();
    }
    else {
      clearInterval(window.interval_id);
    }

  }, interval);
}
/*-------------------------------------------------------------------------------------*/
