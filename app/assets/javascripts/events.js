
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


function process_event(event) {
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
  }

}

// Send requests to the server up to and including 'event_number'
function event_catch_up(event_number) {

  //var event_number_i = Math.max(unprocessed_events.waiting_for, slam.local_number_event_number + 1);
  //var event_number_j = event_number;

  //unprocessed_events.waiting_for = event_number_j;

  console.log ("Event number: " + event_number");
  get_event_range_request(slam.local_event_number + 1, event_number); // BOOKMARK testing
}


function event_new_performance(event) {

  var round = rounds[event.round_number -1];
  var performance = performance_new(event.poet_name);
  var performance_ui = performance_ui_new(performance);

  round.round_js.add_performance(performance);
  $("#performances_" + round.round_number).append(performance_ui);

  window.performances[event.poet_name] = performance_ui;
  window.performance_ids[event.poet_name] = event.performance_id;

}

function event_judge(event) {
  var name = _.invert(window.performance_ids)[event.performance_id];
  comm = window.performances[name].comm;

  comm.event_judge(comm, parseInt(event.judge_name), event.value);
}

function event_set_time(event) {

  var name = _.invert(window.performance_ids)[event.performance_id];
  comm = window.performances[name].comm;

  comm.event_time(comm, event.minutes, event.seconds);
}


function event_set_penalty(event) {
  var name = _.invert(window.performance_ids)[event.performance_id];
  comm = window.performances[name].comm;

  comm.event_penalty(comm, event.penalty);

}
