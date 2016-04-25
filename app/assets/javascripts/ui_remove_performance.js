function make_are_you_sure_div() {

  var row = document.createElement('div');
  row.className = 'row';

  var column = document.createElement('div');
  column.className = 'small-1 columns';
  row.appendChild(column);

  var yes = document.createElement('a');
  yes.setAttribute('href', 'javascript:remove_performance_by_uiid("' + table.id + '")');
  column.append(yes);

  var no = document.createElement('no');
  

  




}

function make_remove_me_div(uiid) {

  var div = document.createElement("div");
  var a = document.createElement("a");

  div.className = "vwli";

  if (!login_info.is_logged_in)
    div.setAttribute('hidden', null);

  a.setAttribute("href", "javascript:remove_performance_by_uiid('" + uiid + "')");
  a.innerHTML = "Remove";

  div.appendChild(a);

  return div;
}

function remove_performance(id) {


  var e = document.getElementById(id);
  if (e == null)
    return;

  e.setAttribute('hidden', null);
}

// Request server remove performance
// Send remove performance event
// remove performance from round
// remove performance_ui 
// put button back


function remove_performance_by_uiid(id) {

  if (!login_info.is_logged_in)
    return;

  var performance_ui = document.getElementById(id);
  remove_performance(performance_ui);

  // Send Requeest to Server
  remove_performance_request(performance_ui.comm);
}


function remove_performance(performance_ui) {

  // Hide or delete the DOM
  performance_ui.setAttribute('hidden', null);

  // Remove the performance object from round_js 
  var performance = performance_ui.performance;
  var round_js = performance.round;

  var i = round_js.performances.indexOf(performance);
  if (i != -1) {
    round_js.performances.splice(i, 1);
    // Recalculate
    round_js.rank();
  }

  // Remove poet from Already Performing
  var round_number = round_js.round_number;
  i = round_number - 1;
  var round = window.rounds[i];
  var name = performance.name;

  i = round.names_already_performing.indexOf(name);
  if (i != -1) {
    round.names_already_performing.splice(i, 1);
  }

  // TODO Make Button to add Poet to round
  var contenders = round.contenders;
  contenders.get_winners(contenders);

}
