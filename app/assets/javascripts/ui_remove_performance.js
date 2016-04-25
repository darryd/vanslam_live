function make_are_you_sure_div(remove_me_div) {

  var row = document.createElement('div');
  row.className = 'row';
  row.uiid = remove_me_div.uiid;

  var column;

  column = document.createElement('div');
  column.className = 'small-4 columns';
  row.appendChild(column);

  var yes = document.createElement('a');
  yes.innerHTML = "Yes";
  yes.uiid = remove_me_div.uiid;
  yes.setAttribute('onclick', 'remove_performance_by_uiid(this.uiid)');

  column.appendChild(yes);


  column = document.createElement('div');
  column.className = 'small-4 columns';
  row.appendChild(column);

  var no = document.createElement('a');
  no.innerHTML = "No";
  no.yes_no_div = row;
  no.setAttribute('onclick', 'replace_yes_no_with_remove_div(this.yes_no_div)');
  column.appendChild(no);


  column = document.createElement('div');
  column.className = 'small-2 column';
  row.appendChild(column);

  var p = document.createElement('p');
  p.innerHTML = '5';
  column.appendChild(p);
  row.time_left = p;

  row.interval = setInterval(function(row) {

    var time_left = parseInt(row.time_left.innerHTML);
    time_left = time_left - 1;

    row.time_left.innerHTML = "" + time_left;

    if (time_left == 0) {
      replace_yes_no_with_remove_div(row);
    }


  }, 1000, row);

  $(remove_me_div).replaceWith(row);
}


function replace_yes_no_with_remove_div(yes_no_div) {

  clearTimeout(yes_no_div.interval);
  var remove_div = make_remove_me_div(yes_no_div.uiid);

  $(yes_no_div).replaceWith(remove_div);


} 

function make_remove_me_div(uiid) {


  var remove_me_div = document.createElement("div");
  
  remove_me_div.uiid = uiid;

  var a = document.createElement("a");
  a.remove_me_div = remove_me_div;

  remove_me_div.className = "vwli";

  if (!login_info.is_logged_in)
    remove_me_div.setAttribute('hidden', null);

  a.setAttribute('onclick', 'make_are_you_sure_div(this.remove_me_div)');
  a.innerHTML = "Remove";

  remove_me_div.appendChild(a);

  return remove_me_div;
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
