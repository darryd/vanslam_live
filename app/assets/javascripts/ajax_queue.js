
var START = 1;
var PENDING = 2;
var DONE = 4;

/*-----------------------------------------------------------------------*/
function process_ajax_queue() {

   if (window.ajax_queue.length == 0)
     return;
   
   if (window.ajax_queue[0].state == PENDING)
     return;

   if (window.ajax_queue[0].state == DONE) {
     window.ajax_queue.splice(0,1);
     return;
   }

   if (window.ajax_queue[0].state == START)
     start_next(window.ajax_queue[0]);

}
/*-----------------------------------------------------------------------*/
function start_next(ticket) {

  ticket.state = PENDING;
  
  ticket.xmlhttp = get_xmlhttp();

  // Run ticket.done when request is complete.
  ticket.xmlhttp.onreadystatechange = function() {
    if (ticket.xmlhttp.readyState==4 && ticket.xmlhttp.status==200) {
      // Run done function.
      ticket.done(jQuery.parseJSON(ticket.xmlhttp.responseText));
      ticket.state = DONE;
    }
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
