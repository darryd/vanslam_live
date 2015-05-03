// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

/*-----------------------------------------------------------------------*/
function click_add_poet(button) {

  var poet_lookup = document.getElementById('poet_lookup');
  var poet_lookup_cancel = document.getElementById('poet_lookup_cancel');
  var suggestions_select = document.getElementById('suggestions_select');


  init_poet_lookup();

  poet_lookup.add_poet_button = button;

  // Hook up buttons to functions
  poet_lookup_cancel.setAttribute('onclick', "poet_lookup_cancel()");
  suggestions_select.setAttribute('onclick', "poet_select();");
  
  poet_lookup.style.top = "" + button.getBoundingClientRect().top + "px"
  poet_lookup.style.left = "" + button.getBoundingClientRect().left + "px";
  button.setAttribute('hidden', null);
  poet_lookup.removeAttribute('hidden');
  document.getElementById('suggestions_input').focus();
}

/*-----------------------------------------------------------------------*/
function poet_lookup_cancel() {

  var poet_lookup = document.getElementById('poet_lookup');
  poet_lookup.setAttribute('hidden', null);
  poet_lookup.add_poet_button.removeAttribute('disabled');

  document.getElementById('add_poet').removeAttribute('hidden');

}
/*-----------------------------------------------------------------------*/
function poet_select() {

  var poets_competing = document.getElementById('poets_competing');
  var list_poets = document.getElementById('list_poets');
  var poet_lookup = document.getElementById('poet_lookup');
  var suggestions_input = document.getElementById('suggestions_input');

  poets_competing.poet_names.push(suggestions_input.value);

  var html_str = "<span style='font-weight:bold'> Poets: </span>";
  html_str += "<span style='color:purple; font-weight:bold'>";
  html_str += poets_competing.poet_names.join(', ');
  html_str += "</span>";

  list_poets.innerHTML = html_str;
}
/*-----------------------------------------------------------------------*/


