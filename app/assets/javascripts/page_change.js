
/*-------------------------------------------------------------------------------------*/
$(document).on('page:change', function () {
  display_login_info();

  var e = document.getElementById('page_change');
  if (e != null)
    switch(e.getAttribute('data-run')){

      case 'competition':
	page_change_competition();
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
    };
  }
}

/*-------------------------------------------------------------------------------------*/

