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

  
  comm.set_time = function(comm, minutes, seconds) {
    alert (minutes + ":" + seconds);
  };

  comm.set_penalty = function(comm, penalty) {
    alert (penalty);
  };

  return comm;
}
