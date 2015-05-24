/*-------------------------------------------------------------------------------------*/

window.init_web_sock = _.once(function() {
  connect_websocket();
  keep_trying_to_connect();

  // Just in case connection is lost but onclose isn't invoked
  /*
  setInterval(function() {
    window.web_sock.close();
    keep_trying_to_connect();
  }, 120000 /* 2 minute /*); 
  */
});
/*-------------------------------------------------------------------------------------*/

function connect_websocket() {

  var scheme = "wss://";
  var uri = scheme + window.document.location.host + "/";

  try {
    window.web_sock = new WebSocket(uri);

    window.web_sock.onmessage = function(message) {

      event = jQuery.parseJSON(message.data);

      process_event(event);
    };

    window.web_sock.onopen = function() {
      console.log("websocket connected.");
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
/*-------------------------------------------------------------------------------------*/
