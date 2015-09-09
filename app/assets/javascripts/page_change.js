
/*-------------------------------------------------------------------------------------*/
$(document).on('page:change', function () {

  // Prepare Queue
  window.ajax_queue = [];
  var interval = 1;
  setInterval(process_ajax_queue, interval);

  // Ok sync requests are bad, but just this one time
  window.login_info = get_json('/welcome/check_login');

  display_login_info();

  var e = document.getElementsByClassName('page_change');
  for (var i=0 ; i < e.length; i++)
  switch(e[i].getAttribute('data-run')){

    case 'competition':
      page_change_competition();
      break;
    case 'poet_lookup':
      page_change_poet_lookup();
      break;
    case 'view_lookup':
      page_change_view_lookup();
      break;
  }
});

/*-------------------------------------------------------------------------------------*/
function prepare_rounds() {

  window.invisible_round = round_new(0); // we'll keep num_places growing for the invisible round
  window.invisible_round.debug_str = "invisible round"; //debugging

  for (var i=0; i<rounds.length; i++) {

    var round_number = i + 1;

    rounds[i].round_js = round_new(rounds[i].num_places, round_number);
    rounds[i].round_js.debug_str = "round " + i;
    rounds[i].names_already_performing = [];


    var prev_round = rounds[i].are_poets_from_previous ? rounds[i-1].round_js : window.invisible_round;
    rounds[i].contenders = contenders_new(rounds[i].round_number, prev_round);
  }

}
/*-------------------------------------------------------------------------------------*/

function manage_class_visible_when_logged_in() {

  var done_func = function(login) {

    var elements = document.getElementsByClassName('visible_when_logged_in');
    for (var i=0; i < elements.length; i++)
      if (login.is_logged_in)
	elements[i].removeAttribute('hidden')
      else
	elements[i].setAttribute('hidden', null);
  }

  check_login_request(done_func);
}

function page_change_competition() {

  manage_class_visible_when_logged_in();
  prepare_rounds();

  var done_func = function(login) {

    if (login.is_logged_in) {

      var poets_competing = document.getElementById("poets_competing");
      poets_competing.removeAttribute('hidden');
      poets_competing.poet_names = [];

      var temp = do_log_out;
      do_log_out = function () {
	temp();
	document.getElementById("poets_competing").setAttribute("hidden", null);
	document.getElementById("poet_lookup").setAttribute("hidden", null);

	// Hide elements that should only be visible when logged in.
	var elements = document.getElementsByClassName('visible_when_logged_in'); // TODO Perhaps this should be default behavior for logging out?
	for (var i=0; i<elements.length; i++)
	  elements[i].setAttribute('hidden', null);

	// Make inputs readonly
	var inputs = document.getElementsByClassName('scorekeeper_input');
	for (var i=0; i<inputs.length; i++)
	  inputs[i].setAttribute('readonly', null);

      };

    }
    else {
      // User is not logged in.
    }
  }

  check_login_request(done_func);

  window.web_sock_id = makeid(20);

  var interval = 1;
  //setInterval(process_ajax_queue, interval);
  slam.local_event_number = 0;
  window.init_web_sock(); 
  setInterval(handle_unprocessed_events, interval);

  for (var i = 0; i < events.length; i++)
    do_event(events[i]);

  what_did_i_miss_request();
}

/*------------------------------------------------------------------------------------*/
function page_change_poet_lookup() {

  var input = document.getElementById('suggestions_input');
  input.addEventListener('keydown', function(e) {
    if (e.keyCode === 38 || e.keyCode === 40) e.preventDefault();
  }, false);


}
/*-------------------------------------------------------------------------------------*/
function page_change_view_lookup() {

  document.getElementById('poet_lookup').removeAttribute('hidden');
  document.getElementById('poet_lookup_cancel').setAttribute('hidden', null);
  document.getElementById('suggestions_create').setAttribute('hidden', null);
  document.getElementById('suggestions_select').setAttribute('hidden', null);
  document.getElementById('suggestions_message').setAttribute('hidden', null);

}
/*-------------------------------------------------------------------------------------*/

