
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

/*
  var e = document.getElementById("number_of_connections");
  if (e != null)
    e.innerHTML = "Number of Connections: " + metric.total_connections;

  if (login_info.is_logged_in)
    document.title = metric.total_connections;
*/
}

function process_subscribers(subscribers) {
    var e = document.getElementById("number_of_subscribers");

    e.innerHTML = "Viewers: " + event.total_subscribers;
}


function process_event(event) {

  try {

    if (event.type == "metrics") {
      var metric = event;

      process_metrics(metric);
      return;
    }

    if (event.type == "subscribers") {
        process_subscribers(event)
        return;
    }

    if (event.type == "heads_up") {
      do_heads_up(event);
      return;
    }

    if (event.type == "reload") {
      location.reload(true);
      return;
    }

    
    if (event.web_sock_id != undefined) {

      try {
        var strings = event.web_sock_id.split(';');
        if (strings.length > 1) {
          event.web_sock_id = strings[0];
          event.confirmation = strings[1];

          collection_of_lights.confirmation_received(event.confirmation);
        }

      }
      catch (e) {
        console.log(e);
      }
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

function last_updated(event) {

  var div = document.getElementById("last_updated");

  var date_pat = /(.*)T/;
  var date =  _.last(date_pat.exec(event.datetime));

  var time_pat = /T(\d*):(\d*):(\d*)/;
  var times = time_pat.exec(event.datetime);

  var time = " " + times[1] + ":" + times[2] + ":" + times[3];

  var datetime = date + time;

  div.innerHTML = "<p><font size='2'> Last updated: " + datetime + "</font></p>";
}


function do_event(event) {

  if (slam.local_event_number + 1 != event.event_number)
    return;

  slam.local_event_number = event.event_number;

  if (event.event != 'signup_poet')
    last_updated(event);

  // I'm making 'new_round' an exceoption to help keep in sync with the server
  if (event.web_sock_id == web_sock_id && event.event != 'new_round') {
    return;
  }

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
    case 'new_round':
      event_new_round(event);
      break;
    case 'announcement':
      event_announcement(event);
      break;
    case 'edit_round':
      event_edit_round(event);
      break;
  }

}

function do_heads_up(event) {

  /*
     if (event.web_sock_id == web_sock_id || event.competition_id != slam.id || comm_2[event.performance_id] == undefined) {
     return; 
     }
     */


  if (event.web_sock_id == web_sock_id) {
    console.log("bad web_sock_id");
    return;
  }

  if (event.competition_id != slam.id) {

    console.log("wrong competition");
    return 
  }

  if (comms_2[event.performance_id] == undefined) {

    console.log("no performance id")
      return;
  }



  switch (event.event) {

    case 'judge':
      event_judge(event);
      break;
    case 'set_time':
      event_set_time(event);
      break;
    case 'set_penalty':
      event_set_penalty(event);
      break;
    case 'focus':
      event_focus(event);
      break;
    case 'blur':
      event_blur(event);
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


  var prev_performance_2 = null;

  if (event.previous_performance_id != null) {
    prev_performance_2 = comms_2[event.previous_performance_id].p_div.performance;
  }

  var performance_2 = performance_new(event.poet_name, prev_performance_2, round.time_limit, round.grace_period, slam.num_judges);
  var p_div = p_div_new(performance_2);

  performance_2.performance_id = event.performance_id;

  round.round_js.add_performance(performance_2);

  performance_2.calculate(); // So that it doesn't say Rank is 'Infinity'

  $("#performances_" + round.round_number).append(p_div);
  resize_inputs(p_div.data_columns);
  auto_scroll.scroll_if_on();

  round.names_already_performing.push(performance_2.name);
  invisible_round.notify_rank();

  p_div.comm.performance_id = event.performance_id;

  window.comms_2[event.performance_id] = p_div.comm;

  // Trigger contenders.get_winners() so that the button to add the performer will be removed  
  if (round.are_poets_from_previous) {

    var previous_round_index = round.previous_round_number == null ? event.round_number - 2 : round.previous_round_number -1;
    rounds[previous_round_index].round_js.rank();
  }

}

function event_announcement(event) {

  var announcement_recv_id = "announcement_recv_" + event.round_number;
  var announcement_recv = document.getElementById(announcement_recv_id);
  
  announcement_recv.innerHTML = event.message;
}


function event_focus(event) {

  try {
    var p_div = window.comms_2[event.performance_id].p_div;

    var minutes_i = p_div.indexes['minutes_i'];
    var seconds_i = p_div.indexes['seconds_i'];

    if (event.index == minutes_i || event.index == seconds_i ) {
      p_div.data_columns[minutes_i].style.fontStyle = 'italic';
      p_div.data_columns[seconds_i].style.fontStyle = 'italic';
    }
    else {
      var input = p_div.data_columns[event.index];
      input.style.fontStyle = "italic";
    }
  }
  catch (e) {
    console.log(e);
  }

}

function event_blur(event) {

  try {
    var p_div = window.comms_2[event.performance_id].p_div;

    var minutes_i = p_div.indexes['minutes_i'];
    var seconds_i = p_div.indexes['seconds_i'];

    if (event.index == minutes_i || event.index == seconds_i ) {
      p_div.data_columns[minutes_i].style.fontStyle = 'normal';
      p_div.data_columns[seconds_i].style.fontStyle = 'normal';
    }
    else {
      var input = p_div.data_columns[event.index];
      input.style.fontStyle = "normal";
    }
  }
  catch (e) {
    console.log(e);
  }

}

function event_judge(event) {
  var comm_2 = window.comms_2[event.performance_id];
  var is_this_a_heads_up = event.type == 'heads_up' ? true : false;

  p_div_set_score(comm_2.p_div, parseInt(event.judge_name), event.value, is_this_a_heads_up);
}

function event_set_time(event) {

  var p_div = window.comms_2[event.performance_id].p_div;
  var is_this_a_heads_up = event.type == 'heads_up' ? true : false;
  p_div_set_time(p_div, event.minutes, event.seconds, is_this_a_heads_up);
}


function event_set_penalty(event) {
  var p_div = window.comms_2[event.performance_id].p_div;
  var is_this_a_heads_up = event.type == 'heads_up' ? true : false;
  p_div_set_penalty(p_div, event.penalty, is_this_a_heads_up);

}

function event_remove_performance(event) {

  var comm_2 = window.comms_2[event.performance_id];

  remove_performance(comm_2.p_div);
}

function event_new_round(event) {

  if (rounds.length >= parseInt(event.round.round_number))
    return; // ignore

  var round = event.round;
  create_round_div(round);
}

function event_edit_round(event) {

    function update_round(round, event) {

        var keys = _.keys(event);

        for (var i=0; i<keys.length; i++) {
            round[keys[i]] = event[keys[i]];
        }
    }
    function update_time_limit_and_grace_period_for_performances(round) {

        var performances = round.round_js.performances;

        for (var i=0; i<performances.length; i++) {

            var performance = performances[i];

            performance.time_limit = round.time_limit;
            performance.grace_period = round.grace_period;

            performance.calculate();
        }
    }

    var round = null;

    for (var i=0; i<rounds.length; i++) {
        if (rounds[i].id == event.round_id) {
            round = rounds[i];
            break;
        }
    }

    if (round == null)
        return;
    
    update_round(round, event);

    //Title
   var e = document.getElementById("round_title_" + round.round_number);
   e.innerHTML = event.title;
   update_time_limit_and_grace_period_for_performances(round);

   // Number of Poets
   round.contenders.get_winners(round.contenders, round);

   // Number of Places

   // Time limit & Grace period
   e = document.getElementById("round_info_" + round.round_number);
   e.innerHTML = generate_round_info_innerHTML(round);

   // Is cumulative

   // Are poets from previous

   // Previous Round Number

}
