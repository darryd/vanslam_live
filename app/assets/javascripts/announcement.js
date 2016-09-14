
function init_announcement_input(input, round_number) {

  var announcement_recv = document.getElementById("announcement_recv_" + round_number);

  if (announcement_recv != null)
    input.value = announcement_recv.innerHTML;
}

function announcement_button_pressed(button) {


  $(button).hide();

  var round_number = button.getAttribute('data-round');
  var div_id = "announcement_" + round_number;
  var t;

  var announcement_div = document.getElementById(div_id);

  var input = document.createElement('input');
  init_announcement_input(input, round_number);

  announcement_div.appendChild(input);

  var cancel_button = document.createElement('button');
  cancel_button.appendChild(document.createTextNode('Cancel'));
  cancel_button.setAttribute('onclick', 'announcement_cancel(this)');
  cancel_button.announcement_div = announcement_div;

  var submit_button = document.createElement('button');
  submit_button.appendChild(document.createTextNode('Submit'));
  submit_button.setAttribute('onclick', 'announcement_submit(this)');
  submit_button.announcement_div = announcement_div;

  announcement_div.appendChild(submit_button);
  announcement_div.appendChild(cancel_button);

  announcement_div.input = input;
  announcement_div.cancel_button = cancel_button;
  announcement_div.submit_button = submit_button;
  announcement_div.announcement_button = button;

  input.focus();
}

function announcement_cancel(cancel_button) {

  var announcement_div = cancel_button.announcement_div;

  $(announcement_div.announcement_button).show();
  announcement_div.removeChild(announcement_div.input);
  announcement_div.removeChild(announcement_div.cancel_button);
  announcement_div.removeChild(announcement_div.submit_button);


}

function announcement_submit(submit_button) {

  var announcement_div = submit_button.announcement_div;
  announcement_request(slam.id, announcement_div.getAttribute('data-round'), announcement_div.input.value); 

  announcement_cancel(submit_button);

}

/*
 * Dynamically create this:
  
   <div id="announcement_0" class="vwli" data-round="0"  hidden>
      <button data-round="0" onclick="announcement_button_pressed(this)">announcement</button>
   </div>
   <h3 id="announcement_recv_0" data-round="0"></h3>

*/
function generate_announcement_dom(index) {


  var dom = [];

  var div = document.createElement('div');
  div.id = 'announcement_' + index;
  div.className = 'vwli';
  div.setAttribute('data-round', index);

  if (!login_info.is_logged_in)
    div.setAttribute('hidden', null);

  var button = document.createElement('button');
  button.setAttribute('data-round', index);
  button.setAttribute('onclick', 'announcement_button_pressed(this)');
  button.appendChild(document.createTextNode('Announcement'));

  div.appendChild(button);
  dom.push(div);

  var h3 = document.createElement('h3');
  h3.id = 'announcement_recv_' + index;
  h3.setAttribute('data-round', index);

  dom.push(h3);

  return dom;
}

function append_announcement_dom() {

  var announcements = document.getElementsByClassName('announcement');
  for (var i = 0; i < announcements.length; i++) {

    var index = announcements[i].getAttribute('data-index');
    var dom = generate_announcement_dom(index);

    for (var j = 0; j < dom.length; j++) 
      announcements[i].appendChild(dom[j]);
  }
}
