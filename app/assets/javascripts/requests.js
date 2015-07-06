
window.comms = {}; // a 'comm' is the connection between the performance_ui and the server

/*-----------------------------------------------------------------------*/
/*
 * Send a new_performance_request and update the performance info
 * once the server responds. This is done in the ticket.done function.
 */
function new_performance_request(round, name, performance_ui){

  var ticket = new_ticket();

  ticket.url = "/competition/new_performance";
  ticket.get_params = function() { 
    
    var previous_performance_id = null;

    var params = {round_id: round.id, name: name, web_sock_id: window.web_sock_id};
    if (round.is_cumulative) {
      // Get previous_performance_id 
      params.previous_performance_id = performance_ui.performance.prev.performance_id;
    }

    return(params)
  };
  ticket.done = function(response_json) {
    console.log(response_json);

// TODO We can check response_json.result

    var performance_id = response_json.performance_id;

    // We just found out the 'performance_id'
    performance_ui.comm.performance_id = performance_id;
    performance_ui.performance.performance_id = performance_id; // For when we need to find the previous_performance_id

    window.comms[performance_id] = performance_ui.comm;
  };

  window.ajax_queue.push(ticket);
}
/*-----------------------------------------------------------------------*/
function judge_request(comm, judge_i, value) {

  var ticket = new_ticket();
  
  ticket.url = "/competition/judge";
  ticket.get_params = function() {

    var performance_id = comm.performance_id;

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

    var performance_id = comm.performance_id;

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

    var performance_id = comm.performance_id;

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
// This function is being phased out and being replaced by what_did_i_miss_request()
function get_event_range_request(event_number_i, event_number_j) {

  var ticket = new_ticket();
  
  ticket.url = "/competition/get_event_range";
  ticket.get_params = function() {
    return {competition_id: slam.id, event_number_i: event_number_i, event_number_j: event_number_j};
  };
  ticket.done = function(response) {
    for (var i=0; i<response.events.length; i++) {
      do_event(response.events[i]);
    }
  };

  window.ajax_queue.push(ticket);
}
/*-----------------------------------------------------------------------*/

function what_did_i_miss_request() {

  var ticket = new_ticket();

  ticket.url = "/competition/what_did_i_miss";
  ticket.get_params = function() { return {competition_id: slam.id, event_number: slam.event_number}};
  ticket.done = function(response) {
    for (var i=0; i<response.events.length; i++) {
      do_event(response.events[i]);
    }
  };

  window.ajax_queue.push(ticket);
}
/*-----------------------------------------------------------------------*/
function signup_poet_request(name) {

  var ticket = new_ticket();
  
  ticket.url = "/competition/signup_poet";
  ticket.get_params = function() {
    return {competition_id: slam.id, name: name, web_sock_id: window.web_sock_id};
  };
  ticket.done = function(response) 
  {
    console.log(response);
  };

  window.ajax_queue.push(ticket);
}
/*-----------------------------------------------------------------------*/
function remove_performance_request(comm) {

  var ticket = new_ticket();
  
  ticket.url = "/competition/remove_performance";
  ticket.get_params = function() {

    var performance_id = comm.performance_id;

    return {performance_id: performance_id, web_sock_id: window.web_sock_id};
  };
  ticket.done = function(response) 
  {
    console.log(response);
  };

  window.ajax_queue.push(ticket);
}
/*-----------------------------------------------------------------------*/
function check_login_request(done_func) {

  var ticket = new_ticket();

  ticket.url = "/welcome/check_login";
  ticket.get_params = function() {return {};};

  ticket.done = done_func;

  window.ajax_queue.push(ticket);
}
/*-----------------------------------------------------------------------*/
