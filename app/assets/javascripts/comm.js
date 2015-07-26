/*
 *
 * Comm - Communications
 *
 * This is the link between the server and the ui
 *
 * */

function comm_new (performance_ui, name) {

  var comm = {};

  comm.performance_ui = performance_ui;
  comm.p_div = performance_ui;

  comm.name = name;

  comm.event_judge = function(comm, judge_i, score) {
    var judge_ui = comm.performance_ui.judges.judges[judge_i].judge_ui;
    judge_ui.input.value = "" + score;
    score_entered(judge_ui, true);
  }
  comm.event_judge_2 = function(comm, judge_i, score) {
    console.log ([comm, judge_i, score]);
  }

  // This function gets called inside of judge_ui.js
  comm.score_entered = function(comm, judge_i, score) {
    judge_request(comm, judge_i, score);
  };
  

  comm.event_time = function(comm, minutes, seconds) {

    var time_ui = comm.performance_ui.time.time_ui;

    time_ui.input_minute.value = minutes;
    time_ui.input_second.value = seconds;

    set_time(time_ui, true);
  }

  // This function gets called inside of time_ui.js
  comm.set_time = function(comm, minutes, seconds) {
    set_time_request(comm, minutes, seconds);
  };


  comm.event_penalty = function(comm, penalty) {

    var penalty_ui = comm.performance_ui.penalty.penalty_ui;

    penalty_ui.penalty_input.value = penalty;
    set_penalty(penalty_ui, true);

  }

  // This function gets called inside of penalty_ui.js
  comm.set_penalty = function(comm, penalty) {
    set_penalty_request(comm, penalty);
  };

  return comm;
}
