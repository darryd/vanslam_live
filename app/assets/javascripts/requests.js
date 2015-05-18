
window.performance_ids = {};

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

    var performance_id = response_json.performance_id;
    var name = performance_ui.performance.name;

    window.performance_ids[name] = performance_id;
    
    performance_ui.comm.performance_id = performance_id;
    round.performances[performance_id] = performance_ui;
  };

  window.ajax_queue.push(ticket);
}
/*-----------------------------------------------------------------------*/
function judge_request(performance_id, judge_i, value) {

  var ticket = new_ticket();
  
  ticket.url = "/competition/judge";
  ticket.get_params = function() {
    return {performance_id: performance_id, judge_name: judge_i, value: value};
  };
  ticket.done = function(response_json) {
    console.log(response_json);
  };

  window.ajax_queue.push(ticket);
}
/*-----------------------------------------------------------------------*/

