
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
  var row;
  var column;
  var label;
  var input;
  
  div.on_done_func = on_done_func;


  row = document.createElement('row');
  row.className = 'row';
  div.appendChild(row);

  // Time period:
  column = document.createElement('div');
  column.className = 'small-4 medium-2 columns';
  row.appendChild(column);

  label = document.createElement('label');
  label.innerHTML = 'Time:';
  column.appendChild(label);

  input = document.createElement('input');
  input.setAttribute('type', 'number');
  input.value = '180';
  label.appendChild(input);
  div.time_input = input;

  // Grace Period:
  column = document.createElement('div');
  column.className = 'small-4 medium-2 columns end';
  row.appendChild(column);

  label = document.createElement('div');
  label.innerHTML = 'Grace:';
  column.appendChild(label);

  input = document.createElement('input');
  input.setAttribute('type', 'number');
  input.value = '10';
  label.appendChild(input);
  div.grace_input = input;


  if (matchMedia('only screen and (max-width: 40em)').matches) {
    row = document.createElement('div');
    row.className = 'row';
    div.appendChild(row);
  }


  // Submit
  column = document.createElement('div');
  column.className = 'small-4 medium-2 columns';
  row.appendChild(column);

  button = document.createElement('button');
  button.setAttribute('onclick', 'on_submit_add_round(this)');
  button.innerHTML = 'Submit';
  button.div = div;
  column.appendChild(button);


  // Cancel
  column = document.createElement('div');
  column.className = 'small-2 columns end';
  row.appendChild(column);

  button = document.createElement('button');
  button.innerHTML = 'Cancel';
  column.appendChild(button);

  return div;
}
