
function init_annoucement_input(input, round_number) {

  var annoucement_recv = document.getElementById("annoucement_recv_" + round_number);

  if (annoucement_recv != null)
    input.value = annoucement_recv.innerHTML;
}

function annoucement_button_pressed(button) {


  $(button).hide();

  var round_number = button.getAttribute('data-round');
  var div_id = "annoucement_" + round_number;
  var t;

  var annoucement_div = document.getElementById(div_id);

  var input = document.createElement('input');
  init_annoucement_input(input, round_number);

  annoucement_div.appendChild(input);

  var cancel_button = document.createElement('button');
  cancel_button.appendChild(document.createTextNode('Cancel'));
  cancel_button.setAttribute('onclick', 'annoucement_cancel(this)');
  cancel_button.annoucement_div = annoucement_div;

  var submit_button = document.createElement('button');
  submit_button.appendChild(document.createTextNode('Submit'));
  submit_button.setAttribute('onclick', 'annoucement_submit(this)');
  submit_button.annoucement_div = annoucement_div;

  annoucement_div.appendChild(submit_button);
  annoucement_div.appendChild(cancel_button);

  annoucement_div.input = input;
  annoucement_div.cancel_button = cancel_button;
  annoucement_div.submit_button = submit_button;
  annoucement_div.annoucement_button = button;
}

function annoucement_cancel(cancel_button) {

  var annoucement_div = cancel_button.annoucement_div;

  $(annoucement_div.annoucement_button).show();
  annoucement_div.removeChild(annoucement_div.input);
  annoucement_div.removeChild(annoucement_div.cancel_button);
  annoucement_div.removeChild(annoucement_div.submit_button);


}

function annoucement_submit(submit_button) {

  var annoucement_div = submit_button.annoucement_div;
  annoucement_request(slam.id, annoucement_div.getAttribute('data-round'), annoucement_div.input.value); 

  annoucement_cancel(submit_button);

}
