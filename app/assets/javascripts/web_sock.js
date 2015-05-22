
/*-------------------------------------------------------------------------------------*/

window.init_web_sock = _.once(function() {

  var scheme = "wss://";
  var uri = scheme + window.document.location.host + "/";

  window.web_sock = new WebSocket(uri);

  window.web_sock.onmessage = function(message) {console.log(message);};
  window.web_sock.onclose = function() {console.log("websocket connection closed")};
  window.web_sock.onerror = function() {console.log("websocket error")};

});
/*-------------------------------------------------------------------------------------*/
