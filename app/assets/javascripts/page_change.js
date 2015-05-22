
/*-------------------------------------------------------------------------------------*/
$(document).on('page:change', function () {

  var scheme = "wss://";
  var uri = scheme + window.document.location.host + "/";
  window.web_sock = new WebSocket(uri);

  default_functions(window.web_sock);



  window.web_sock.onmessage = function(message) {console.log(message);};
  window.web_sock.onclose = function() {console.log("websocket connection closed")};

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

  for (var i=0; i<rounds.length; i++) {
    rounds[i].round_js = round_new(0); // FIXME: param wrong
    rounds[i].performances = {};
  }

}
/*-------------------------------------------------------------------------------------*/
function page_change_competition() {

  prepare_rounds();

  if (get_login_info().is_logged_in) {

    window.web_sock_id = makeid(20);

    var poets_competing = document.getElementById("poets_competing");
    poets_competing.removeAttribute('hidden');
    poets_competing.poet_names = [];

    var temp = do_log_out;
    do_log_out = function () {
      temp();
      document.getElementById("poets_competing").setAttribute("hidden", null);
      document.getElementById("poet_lookup").setAttribute("hidden", null);
      // We can make a class="hide on loggout"
    };

    // Prepare Queue
    window.ajax_queue = [];
    var interval = 10;
    //var interval = 3000; // For testing
    setInterval(process_ajax_queue, interval);
  }
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

