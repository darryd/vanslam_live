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

  comm.score_entered = function(judge_i, score) {

     // Notify server
     // for now just print result
     console.log ([judge_i, score]);

  }

  return comm;
}
