
window.performance_ids = {};
window.performances = {};

/*-----------------------------------------------------------------------*/
/*
 * Send a new_performance_request and update the performance info
 * once the server responds. This is done in the ticket.done function.
 */
function new_performance_request(round, name, performance_ui){

  var ticket = new_ticket();

  window.performances[name] = performance_ui;

  ticket.url = "/competition/new_performance";
  ticket.get_params = function() { return({round_id: round.id, name: name, web_sock_id: window.web_sock_id})};
  ticket.done = function(response_json) {
    console.log(response_json);

// TODO We can check response_json.result

    var performance_id = response_json.performance_id;
    var name = performance_ui.performance.name;

    // We just found out the 'performance_id' for 'name'
    window.performance_ids[name] = performance_id;
    
    performance_ui.comm.performance_id = performance_id;
    //round.performances[performance_id] = performance_ui;
  };

  window.ajax_queue.push(ticket);
}
/*-----------------------------------------------------------------------*/
function judge_request(comm, judge_i, value) {

  var ticket = new_ticket();
  
  ticket.url = "/competition/judge";
  ticket.get_params = function() {


    var performance_id = window.performance_ids[comm.name];

    return {performance_id: performance_id, judge_name: judge_i, value: value, web_sock_id: window.web_sock_id};
  };
  ticket.done = function(response_json) {
    console.log(response_json);
  };

  window.ajax_queue.push(ticket);
}
/*-----------------------------------------------------------------------*/
function set_time_request(comm, minutes, seconds) {

  var ticket = new_ticket();

  ticket.url = "/competition/set_time";
  ticket.get_params = function() {

    var performance_id = window.performance_ids[comm.name];

    return {performance_id: performance_id, minutes: minutes,seconds: seconds, web_sock_id: window.web_sock_id};
  };

  ticket.done = function(response_json) {console.log(response_json);};

  window.ajax_queue.push(ticket);
}

/*-----------------------------------------------------------------------*/
function set_penalty_request(comm, penalty) {

  var ticket = new_ticket();

  ticket.url = "/competition/set_penalty";
  ticket.get_params = function() {

    var performance_id = window.performance_ids[comm.name];

    return {performance_id: performance_id, penalty: penalty, web_sock_id: window.web_sock_id};
  };

  ticket.done = function(response_json) {console.log(response_json);};

  window.ajax_queue.push(ticket);
}

/*-----------------------------------------------------------------------*/
function get_event_request(event_number) {

  var ticket = new_ticket();

  ticket.url = "/competition/get_event";
  ticket.get_params = function() {return {competition_id: slam.id, event_number: event_number};};
  ticket.done = function (event) {
    if (event.result)
      window.unprocessed_events[event.event_number] = event;
  };

  window.ajax_queue.push(ticket);
}

/*-----------------------------------------------------------------------*/
// Gets the current event number and then updates by calling event_catch_up()
function get_current_event_number_request() {
  
  var ticket = new_ticket();

  ticket.url = "/competition/get_current_event_number";
  ticket.get_params = function() {return {competition_id: slam.id};};
  ticket.done = function(response) {

    slam.event_number = response.event_number;

    if (slam.event_number > slam.local_event_number) {
      event_catch_up(response.event_number);
    }
  };

  window.ajax_queue.push(ticket);
}
/*-----------------------------------------------------------------------*/
function get_event_range_request(event_number_i, event_number_j) {

  var ticket = new_ticket();
  
  ticket.url = "/competition/get_event_range";
  ticket.get_params = function() {
    return {competition_id: slam.id, event_number_i: event_number_i, event_number_j: event_number_j};
  };
  ticket.done = function(response) {
    alert("response.events.length = " + response.events.length);
    for (var i=0; i<response.events.length; i++) {
      alert (i + " == " + response.events[i].event_number );
      do_event(response.events[i]);
    }
  };

  window.ajax_queue.push(ticket);
}
/*-----------------------------------------------------------------------*/
