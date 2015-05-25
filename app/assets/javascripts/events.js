
window.unprocessed_events = {};
unprocessed_events.waiting_for = 0;

// Hand unprocessed events
setInterval(function() {

  if (slam.local_event_number == slam.event_number) {
    // Everything is up to date.
    return;
  }

  if (window.unprocessed_events[slam.event_number + 1] !== undefined) {
    // Handle next event.
    do_event(unprocessed_events[slam.event_number + 1]);
    delete (unprocessed_events[slam.event_number + 1]);

  }

}, 100);


function process_event(event) {
  if (event.competition_id != slam.id)
    return;

  if (event.event_number == slam.local_event_number + 1) {
    do_event(event);
  }
  else {
    alert ("catch up required");
  }
}

function do_event(event) {

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

function event_cath_up() {


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
