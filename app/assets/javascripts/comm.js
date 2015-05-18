/*
 *
 * Comm - Communications
 *
 * This is the link between the server and the ui
 *
 * */

function comm_new (performance_id) {

  var comm = {};

  comm.performance_id = performance_id;

  // This function gets called inside of judge_ui.js
  comm.score_entered = function(performance_id, judge_i, score) {
   

     // Notify server
     console.log ([performance_id, judge_i, score]);

     judge_request(performance_id, judge_i, score); // BOOKMARK

  }

  return comm;
}
