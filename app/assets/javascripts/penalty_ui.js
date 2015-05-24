
/*----------------------------------------------------------------------------------------------------------------------------------*/

penalty_ui_new = function (performance, comm) {

  var penalty_ui = {};
  penalty_ui.comm = comm;

  penalty_ui.performance = performance;
  penalty_ui.penalty_input = create_input(penalty_ui, "set_penalty(this.ui)");

  return build_input_table("add penalty:", penalty_ui.penalty_input);
}

/*----------------------------------------------------------------------------------------------------------------------------------*/

function set_penalty(penalty_ui, from_comm) {

  var penalty = parseFloat(penalty_ui.penalty_input.value);
  penalty_ui.performance.set_penalty(penalty);
  // Don't send data to comm if data was from comm. 
  if (!from_comm)
    penalty_ui.comm.set_penalty(penalty_ui.comm, penalty);

}
/*----------------------------------------------------------------------------------------------------------------------------------*/
