
/*-------------------------------------------------------------------------------------*/
$(document).on('page:change', function () {
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
  }
});

/*-------------------------------------------------------------------------------------*/
function page_change_competition() {

  if (get_login_info().is_logged_in) {
    document.getElementById("poets_competing").removeAttribute('hidden');

    var temp = do_log_out;
    do_log_out = function () {
      temp();
      document.getElementById("poets_competing").setAttribute("hidden", null);
      document.getElementById("poet_lookup").setAttribute("hidden", null);
    };
  }
}

/*-------------------------------------------------------------------------------------*/
function page_change_poet_lookup() {

  var input = document.getElementById('suggestions_input');
  input.addEventListener('keydown', function(e) {
    if (e.keyCode === 38 || e.keyCode === 40) e.preventDefault();
  }, false);

  document.getElementById('poet_lookup').removeAttribute('hidden');

}
/*-------------------------------------------------------------------------------------*/
