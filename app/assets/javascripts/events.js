
var unprocessed_events = {};
unprocessed_events.waiting_for = 0;

// Handle unprocessed events
function handle_unprocessed_events() {

  if (slam.local_event_number == slam.event_number) {
    // Everything is up to date.
    return;
  }

  if (unprocessed_events[slam.local_event_number + 1] !== undefined) {
    // Handle next event.

    var i = slam.local_event_number + 1;

    do_event(unprocessed_events[i]);
    delete (unprocessed_events[i]);
  }
}

function process_metrics(metric) {

  var e = document.getElementById("number_of_connections");
  if (e != null)
    e.innerHTML = "Number of Connections: " + metric.total_connections;

  document.title = metric.total_connections;
}


function process_event(event) {

  try {

    if (event.type == "metrics") {
      var metric = event;

      process_metrics(metric);
      return;
    }
  }
  catch(e) {}

  if (event.competition_id != slam.id)
    return;

  slam.event_number = event.event_number;

  if (event.event_number == slam.local_event_number + 1) {
    do_event(event);
  }
  else {

    unprocessed_events[event.event_number] = event;
    event_catch_up(event.event_number - 1);
  }
}

function do_event(event) {

  if (slam.local_event_number + 1 != event.event_number)
    return;

  slam.local_event_number = event.event_number;

  if (event.web_sock_id == web_sock_id)
    return;

  switch (event.event) {

    case 'new_performance':
      event_new_performance(event);
      break;
    case 'judge':
      event_judge(event);
      break;
    case 'set_time':
      event_set_time(event);
      break;
    case 'set_penalty':
      event_set_penalty(event);
      break;
    case 'signup_poet':
      signup_poet(event.name);
      break;
    case 'remove_performance':
      event_remove_performance(event);
      break;
  }

}

// Send requests to the server up to and including 'event_number'
function event_catch_up(event_number) {

  var event_number_i = Math.max(unprocessed_events.waiting_for, slam.local_number_event_number + 1);
  var event_number_j = event_number;

  unprocessed_events.waiting_for = event_number_j;
  get_event_range_request(event_number_i, event_number_j);
}


function event_new_performance(event) {

  var round = rounds[event.round_number -1];


  // If the round is cumulative than we need to get the prev performance.
  var prev_performance = null;
  var prev_performance_2 = null;

  if (event.previous_performance_id != null) {
    prev_performance = comms[event.previous_performance_id].performance_ui.performance;
    prev_performance_2 = comms_2;
  }

  var performance = performance_new(event.poet_name, prev_performance, round.time_limit, slam.num_judges);
  var performance_2 = performance_new(event.poet_name, prev_performance, round.time_limit, slam.num_judges);

  var performance_ui = performance_ui_new(performance);
  var p_div = p_div_new(performance_2);

  performance.performance_id = event.performance_id; // BOOKMARK
  performance_2.performance_id = event.performance_id;

  round.round_js.add_performance(performance);
  round.round_js.add_performance(performance_2);

  performance.calculate(); // So that it doesn't say Rank is 'Infinity'
  performance_2.calculate(); // So that it doesn't say Rank is 'Infinity'

  $("#performances_" + round.round_number).append(performance_ui);
  $("#performances_" + round.round_number).append(p_div);
  round.names_already_performing.push(performance.name);

  performance_ui.comm.performance_id = event.performance_id;
  p_div.comm.performance_id = event.performance_id;

  window.comms[event.performance_id] = performance_ui.comm;
  window.comms_2[event.performance_id] = p_div.comm;

  // Trigger contenders.get_winners() so that the button to add the performer will be removed  
  if (round.are_poets_from_previous)
    rounds[event.round_number - 2].round_js.rank();

}

function event_judge(event) {
  var comm = window.comms[event.performance_id];
  //var comms_2 = window

  comm.event_judge(comm, parseInt(event.judge_name), event.value);
  comm.event_judge_2(comm, parseInt(event.judge_name), event.value);
}

function event_set_time(event) {

  var comm = window.comms[event.performance_id];

  comm.event_time(comm, event.minutes, event.seconds);
}


function event_set_penalty(event) {
  var comm = window.comms[event.performance_id];

  comm.event_penalty(comm, event.penalty);

}

function event_remove_performance(event) {

  var comm = window.comms[event.performance_id];

  remove_performance(comm.performance_ui);
}
