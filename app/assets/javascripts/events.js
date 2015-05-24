
function process_event(event) {

  if (event.web_sock_id == web_sock_id)
    return;

  if (event.competition_id != slam.id)
    return;

  do_event(event);
}

function do_event(event) {

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
