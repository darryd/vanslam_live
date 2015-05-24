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
  comm.name = name;

  comm.event_score = function(comm, judge_i, score) {
    var judge_ui = comm.performance_ui.judges_ui.judges[judge_i].judge_ui;
    judge_ui.input.value = "" + score;
    score_entered(judge_ui, true);
  }

  // This function gets called inside of judge_ui.js
  comm.score_entered = function(comm, judge_i, score) {
    judge_request(comm, judge_i, score);
  };
  

  comm.event_time = function(comm, minutes, seconds) {

  }

  // This function gets called inside of time_ui.js
  comm.set_time = function(comm, minutes, seconds) {
    set_time_request(comm, minutes, seconds);
  };


  comm.event_penalty = function(comm, penalty) {

  }

  // This function gets called inside of penalty_ui.js
  comm.set_penalty = function(comm, penalty) {
    set_penalty_request(comm, penalty);
  };

  return comm;
}
