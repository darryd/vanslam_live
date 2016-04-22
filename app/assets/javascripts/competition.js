// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

/*-----------------------------------------------------------------------*/
function click_add_poet(button) {

  var poet_lookup = document.getElementById('poet_lookup');
  var poet_lookup_cancel = document.getElementById('poet_lookup_cancel');
  var suggestions_select = document.getElementById('suggestions_select');


//  init_poet_lookup();

  poet_lookup.add_poet_button = button;

  // Hook up buttons to functions
  poet_lookup_cancel.setAttribute('onclick', "poet_lookup_cancel()");
  suggestions_select.setAttribute('onclick', "poet_select();");

  poet_lookup.style.top = "" + button.getBoundingClientRect().top + "px";
  poet_lookup.style.left = "" + button.getBoundingClientRect().left + "px";
  button.setAttribute('hidden', null);
  poet_lookup.removeAttribute('hidden');
  document.getElementById('suggestions_input').focus();
}

/*-----------------------------------------------------------------------*/

// Scorekeeper presses Minimize.. (was called cancel)
function poet_lookup_cancel() {

  var poet_lookup = document.getElementById('poet_lookup');
  poet_lookup.setAttribute('hidden', null);
  poet_lookup.add_poet_button.removeAttribute('disabled');

  document.getElementById('add_poet').removeAttribute('hidden');

}
/*-----------------------------------------------------------------------*/

// Scorekeeper presses the Select button.
function poet_select() {

  var poets_competing = document.getElementById('poets_competing');
  var list_poets = document.getElementById('list_poets');
  var poet_lookup = document.getElementById('poet_lookup');
  var suggestions_input = document.getElementById('suggestions_input');

  var name = document.getElementById('suggestions').name_as_stored_in_database;

  // Don't Select Poet if Poet has already been selected.
  if (poets_competing.poet_names.indexOf(name) == -1) {
    poets_competing.poet_names.push(name);

    /*
    poets_competing.poet_names = poets_competing.poet_names.sort( function (a, b) { 
      return a.toLowerCase().localeCompare(b.toLowerCase()); });
    */

    var html_str = "<span style='font-weight:bold'> Poets: </span>";
    html_str += "<span style='color:purple; font-weight:bold'>";
    html_str += poets_competing.poet_names.join(', ');
    html_str += "</span>";

    list_poets.innerHTML = html_str;

    // Clear Input and its suggestions
    suggestions_input.value = '';
    display_suggestions_for_name(document.getElementById('suggestions'), '');

    signup_poet(name);
    signup_poet_request(name);
  }
}

/*-----------------------------------------------------------------------*/
function signup_poet(name) {

    // Add poet button to rounds which doesn't get its poets from a previous round.
    var invisible_performance = performance_new(name, null, 0, 0, slam.num_judges);
    invisible_round.add_performance(invisible_performance);
    invisible_round.num_places = invisible_round.performances.length;
    invisible_performance.rank = 1;
    invisible_round.notify_rank(); 
}
/*-----------------------------------------------------------------------*/

/*
 * When this is clicked a new_performance request is sent to the server.
 *
 * A performance_ui is created.
 *
 *
 * Requirements: button.round, button.prev_performane (or null)
 *   
 *
 *
 */


function click_poet(button) {

// TODO Refactor code: this is somewhat duplicated in event_new_performance()
  // Create new request for a new performance
  var round = button.round;

  var prev_performance = button.round.is_cumulative ? button.prev_performance : null; 

  var performance_2 = performance_new(button.name, prev_performance, round.time_limit, round.grace_period, slam.num_judges);
  var p_div = p_div_new(performance_2);

  // We add the performance to the round.
  round.round_js.add_performance(performance_2);
  performance_2.calculate(); //Otherwise rank says 'Infinity'

  $("#performances_" + round.round_number).append(p_div);
  round.names_already_performing.push(performance_2.name);
  invisible_round.notify_rank();

  // Send request to server
  
  new_performance_request(round, button.name, p_div);
  p_div.judge_inputs[0].focus();
}
