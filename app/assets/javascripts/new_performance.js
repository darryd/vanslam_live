
/*-----------------------------------------------------------------------*/
/*
 * Send a new_performance_request and update the performance info
 * once the server responds. This is done in the ticket.done function.
 */
function new_performance_request(round, name, performance_ui){

  var ticket = new_ticket();

  ticket.url = "/competition/new_performance";
  ticket.get_params = function() { return({round_id: round.id, name: name})};
  ticket.done = function(response_json) {
    console.log(response_json);

// TODO We can check response_json.result

    performance_ui.performance_id = response_json.performance_id;
    round.performances[response_json.performance_id] = performance_ui;

  };

  window.ajax_queue.push(ticket);
}
/*-----------------------------------------------------------------------*/
