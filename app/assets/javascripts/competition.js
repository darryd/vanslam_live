// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

/*-----------------------------------------------------------------------*/
function click_add_poet(button) {

  var poet_lookup = document.getElementById('poet_lookup');
  var poet_lookup_cancel = document.getElementById('poet_lookup_cancel');


  init_poet_lookup();

  poet_lookup.add_poet_button = button;

  poet_lookup_cancel.setAttribute('onclick', "poet_lookup_cancel()");
  
  poet_lookup.style.top = "" + button.getBoundingClientRect().top + "px"
  poet_lookup.style.left = "" + button.getBoundingClientRect().left + "px";

  button.setAttribute('disabled', null);
  poet_lookup.removeAttribute('hidden');
  document.getElementById('suggestions_input').focus();
}

/*-----------------------------------------------------------------------*/
function poet_lookup_cancel() {

  var poet_lookup = document.getElementById('poet_lookup');
  poet_lookup.setAttribute('hidden', null);
  poet_lookup.add_poet_button.removeAttribute('disabled');

}
/*-----------------------------------------------------------------------*/


