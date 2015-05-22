/*
 *
 * Comm - Communications
 *
 * This is the link between the server and the ui
 *
 * */

function comm_new (name) {

  var comm = {};

  comm.name = name;

  // This function gets called inside of judge_ui.js
  comm.score_entered = function(comm, judge_i, score) {
    judge_request(comm, judge_i, score);
  };

  
  // This function gets called inside of judge_ui.js
  comm.set_time = function(comm, minutes, seconds) {
    set_time_request(comm, minutes, seconds);
  };

  // This function gets called inside of judge_ui.js
  comm.set_penalty = function(comm, penalty) {
    set_penalty_request(comm, penalty);
  };

  return comm;
}
