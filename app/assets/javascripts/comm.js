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
   

    var performance_id = window.performance_ids[comm.name];

     // Notify server
     console.log ([performance_id, judge_i, score]);

     judge_request(performance_id, judge_i, score); // BOOKMARK

  }

  return comm;
}
