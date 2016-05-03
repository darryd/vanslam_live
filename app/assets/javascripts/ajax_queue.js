
var START = 1;
var PENDING = 2;
var DONE = 4;

/*-----------------------------------------------------------------------*/
function process_ajax_queue() {


  display_queue();
  

   if (window.ajax_queue.length == 0)
     return;
   
   if (window.ajax_queue[0].state == PENDING) {
     window.ajax_queue[0].clicks++;

     // Experimental
     if (window.ajax_queue[0].clicks == 4000)
       window.ajax_queue[0].state = START;

     return;
   }

   if (window.ajax_queue[0].state == DONE) {
     window.ajax_queue.splice(0,1);
     return;
   }

   if (window.ajax_queue[0].state == START)
     start_next(window.ajax_queue[0]);

}
/*-----------------------------------------------------------------------*/
function display_queue() {

  var p = document.getElementById("ajax_queue");
  p.innerHTML = ajax_queue_to_str();

}
/*-----------------------------------------------------------------------*/
function ajax_queue_to_str() {

  var str = "Queue: ";

  for (var i = 0; i < window.ajax_queue.length; i++) {
    switch (window.ajax_queue[i].state) {
      case START:
	str += " S ";
	break;
      case PENDING:
	str += " P ";
	break;
      case DONE:
	str += " D ";
	break;
    }
  }

  return str;
}
/*-----------------------------------------------------------------------*/
function start_next(ticket) {

  ticket.state = PENDING;
  ticket.clicks = 0;

  ticket.xmlhttp = get_xmlhttp();

  // Run ticket.done when request is complete.
  ticket.xmlhttp.onreadystatechange = function() {

    console.log(ticket.xmlhttp);
    console.log(['ReadyState', ticket.xmlhttp.readyState]);
    console.log(['status', ticket.xmlhttp.status]);


    try {
      if (ticket.xmlhttp.readyState==4) {
	if (ticket.xmlhttp.status==200) {
	  // Run done function.
	  ticket.done(jQuery.parseJSON(ticket.xmlhttp.responseText));
	  ticket.state = DONE;
	}
	else {

	  // Try again
	  ticket.state = START;
	}
      }
    }
    catch(e) {

      alert (e.description);
      console.log(e.description);
    }
  };

  // Timeout
  ticket.xmlhttp.timeout = 9000;
  ticket.xmlhttp.ontimeout = function() {
    ticket.state = START;
    console.log("Request timed out");
  };

  // If there's an error reset to START
  ticket.xmlhttp.onerror = function() {
    ticket.state = START;
  };

  // Send request
  post_async(ticket.xmlhttp, ticket.url, ticket.get_params());

}
/*-----------------------------------------------------------------------*/
// Returns an empty ticket. Tickets go on to the queue.
// See send_echo_request() to see how this is done.

function new_ticket() {
  return {state: START, url: '', get_params: null, done: null};
}

/*-----------------------------------------------------------------------*/

function send_echo_request(sentence) {

  var ticket = new_ticket();

  ticket.url = "/competition/echo";

  ticket.get_params = function () {return {"sentence": sentence};};

  ticket.done = function(response_json) {console.log(response_json);};

  window.ajax_queue.push(ticket);
}
/*-----------------------------------------------------------------------*/
