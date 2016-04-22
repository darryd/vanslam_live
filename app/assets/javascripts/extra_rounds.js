
function onclick_add_round() {

  var div = document.getElementById('add_extra_round');
  var add_round_div = get_add_round_div();

  div.appendChild(add_round_div);
}

function on_submit_add_round(button) {

  var time = parse_int_or_return_zero(button.div.time_input.value);
  var grace = parse_int_or_return_zero(button.div.grace_input.value);

  alert ("time: " + time + " grace: " + grace);
}


function get_add_round_div(on_done_func) {

  var div = document.createElement('div');
  var column;
  var label;
  var input;
  
  div.on_done_func = on_done_func;
  div.className = 'row';


  // Time period:
  column = document.createElement('div');
  column.className = 'small-2 columns';
  div.appendChild(column);

  label = document.createElement('label');
  label.innerHTML = 'Time (seceonds):';
  column.appendChild(label);

  input = document.createElement('input');
  input.setAttribute('type', 'number');
  input.value = '180';
  label.appendChild(input);
  div.time_input = input;

  // Grace Period:
  column = document.createElement('div');
  column.className = 'small-2 columns';
  div.appendChild(column);

  label = document.createElement('div');
  label.innerHTML = 'Grace (seconds):';
  column.appendChild(label);

  input = document.createElement('input');
  input.setAttribute('type', 'number');
  input.value = '10';
  label.appendChild(input);
  div.grace_input = input;

  // Submit
  column = document.createElement('div');
  column.className = 'small-2 columns';
  div.appendChild(column);

  button = document.createElement('button');
  button.setAttribute('onclick', 'on_submit_add_round(this)');
  button.innerHTML = 'Submit';
  button.div = div;
  div.appendChild(button);


  // Cancel
  column = document.createElement('div');
  column.className = 'small-2 columns end';
  div.appendChild(column);

  button = document.createElement('button');
  button.innerHTML = 'Cancel';
  div.appendChild(button);

  return div;
}
