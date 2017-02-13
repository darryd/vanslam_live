function new_edit_round (round) {

  console.log(round);

}

function onclick_edit_round() {

  var edit_round_a = this;
  var round_number = parseInt($(this).data('round_number'));
  var round = window.rounds[round_number - 1];

  var edit_round_div = document.getElementById("edit_round_div_" + round_number); 


  var cancel_a = document.createElement("a");
  cancel_a.innerHTML = "Cancel Editing Round " + round_number;

  edit_round_div.appendChild(cancel_a);

  var form_div = make_edit_round_form(round, cancel_a); 
  edit_round_div.appendChild(form_div);


  $(cancel_a).click(function() {
    this.remove();
    form_div.remove();
    $(edit_round_a).show();
  });

  $(this).hide();

}

function make_edit_round_form(round, cancel_a) {
  
  var div = document.createElement('div');

  var row;


/*
  add_label_input_to_row(row, "Title", round.title);
  add_label_input_to_row(row, "Number of poets", round.num_poets);
  add_label_input_to_row(row, "Number of places", round.num_places);
  add_label_input_to_row(row, "Time limit", round.time_limit);
  add_label_input_to_row(row, "Grace period", round.grace_period);
  add_label_input_to_row(row, "Is cumulative", round.is_cumulative);
  add_label_input_to_row(row, "Previous round number", round.previous_round_number);
*/


// -------------- Title ------------------

  row = document.createElement('div');
  row.className = "row";
  div.appendChild(row);

  var column_title = document.createElement('div');
  column_title.className = 'small-2 columns';
  var label_title = document.createElement('label');
  label_title.innerHTML = 'Title';

  var input_title = document.createElement('input');
  input_title.value = round.title;

  row.appendChild(column_title);
  column_title.appendChild(label_title);
  label_title.appendChild(input_title);

// -------------- Num Poets ------------------

  row = document.createElement('div');
  row.className = "row";
  div.appendChild(row);

  var column_num_poets = document.createElement('div');
  column_num_poets.className = 'small-2 columns';
  var label_num_poets = document.createElement('label');
  label_num_poets.innerHTML = 'Number of Poets';

  var input_num_poets = document.createElement('input');
  input_num_poets.value = round.num_poets;

  row.appendChild(column_num_poets);
  column_num_poets.appendChild(label_num_poets);
  label_num_poets.appendChild(input_num_poets);

// -------------- Num Places ------------------

  row = document.createElement('div');
  row.className = "row";
  div.appendChild(row);

  var column_num_places = document.createElement('div');
  column_num_places.className = 'small-2 columns';
  var label_num_places = document.createElement('label');
  label_num_places.innerHTML = 'Number of Places';

  var input_num_places = document.createElement('input');
  input_num_places.value = round.num_places;

  row.appendChild(column_num_places);
  column_num_places.appendChild(label_num_places);
  label_num_places.appendChild(input_num_places);
// -------------- Time Limit ------------------

  row = document.createElement('div');
  row.className = "row";
  div.appendChild(row);

  var column_time_limit = document.createElement('div');
  column_time_limit.className = 'small-2 columns';
  var label_time_limit = document.createElement('label');
  label_time_limit.innerHTML = 'Time Limit';

  var input_time_limit = document.createElement('input');
  input_time_limit.value = round.time_limit;

  row.appendChild(column_time_limit);
  column_time_limit.appendChild(label_time_limit);
  label_time_limit.appendChild(input_time_limit);
// -------------- Grace Period ------------------

  row = document.createElement('div');
  row.className = "row";
  div.appendChild(row);

  var column_grace_period = document.createElement('div');
  column_grace_period.className = 'small-2 columns';
  var label_grace_period = document.createElement('label');
  label_grace_period.innerHTML = 'Grace Period';

  var input_grace_period = document.createElement('input');
  input_grace_period.value = round.grace_period;

  row.appendChild(column_grace_period);
  column_grace_period.appendChild(label_grace_period);
  label_grace_period.appendChild(input_grace_period);
// -------------- Is Cumulative -----------

  row = document.createElement('div');
  row.className = "row";
  div.appendChild(row);

  var column_is_cumulative = document.createElement('div');
  column_is_cumulative.className = 'small-2 columns';
  var label_is_cumulative = document.createElement('label');
  label_is_cumulative.innerHTML = 'Is Cumulative';

  var input_is_cumulative = document.createElement('input');
  input_is_cumulative.value = round.is_cumulative;

  row.appendChild(column_is_cumulative);
  column_is_cumulative.appendChild(label_is_cumulative);
  label_is_cumulative.appendChild(input_is_cumulative);
// -------------- Are Poets From Previous -----------

  row = document.createElement('div');
  row.className = "row";
  div.appendChild(row);

  var column_are_poets_from_previous = document.createElement('div');
  column_are_poets_from_previous.className = 'small-2 columns';
  var label_are_poets_from_previous = document.createElement('label');
  label_are_poets_from_previous.innerHTML = 'Are Poets From Previous';

  var input_are_poets_from_previous = document.createElement('input');
  input_are_poets_from_previous.value = round.are_poets_from_previous;

  row.appendChild(column_are_poets_from_previous);
  column_are_poets_from_previous.appendChild(label_are_poets_from_previous);
  label_are_poets_from_previous.appendChild(input_are_poets_from_previous);

// -------------- Previous Round Number -----------

  row = document.createElement('div');
  row.className = "row";
  div.appendChild(row);

  var column_previous_round_number = document.createElement('div');
  column_previous_round_number.className = 'small-2 columns';
  var label_previous_round_number = document.createElement('label');
  label_previous_round_number.innerHTML = 'Previous Round Number';

  var input_previous_round_number = document.createElement('input');
  input_previous_round_number.value = round.previous_round_number;

  row.appendChild(column_previous_round_number);
  column_previous_round_number.appendChild(label_previous_round_number);
  label_previous_round_number.appendChild(input_previous_round_number);
// -------------- Submit and Cancel -----------

  row = document.createElement('div');
  row.className = "row";
  div.appendChild(row);

  var submit_button = document.createElement("button");
  submit_button.innerHTML = "Submit";
  row.appendChild(submit_button);

  submit_button.round = round;
  submit_button.input_title = input_title;
  submit_button.input_num_poets = input_num_poets;
  submit_button.input_num_places = input_num_places;
  submit_button.input_time_limit = input_time_limit;
  submit_button.input_grace_period = input_grace_period;
  submit_button.input_is_cumulative = input_is_cumulative;
  submit_button.input_are_poets_from_previous = input_are_poets_from_previous;
  submit_button.input_previous_round_number = input_previous_round_number;
 
  $(submit_button).click(function() {
          edit_round_request(this.round.id, 
                             this.input_title.value,
                             this.input_num_poets.value,
                             this.input_num_places.value,
                             this.input_time_limit.value,
                             this.input_grace_period.value,
                             this.input_is_cumulative.value,
                             this.input_are_poets_from_previous.value,
                             this.input_previous_round_number.value
                             );

          $(this.cancel_button).click();
  });


  var cancel_button = document.createElement("button");
  cancel_button.innerHTML = "Cancel";
  cancel_button.cancel_a = cancel_a;
  row.appendChild(cancel_button);


  cancel_button.string = "Fredom is another word for nothing left to lose";
  $(cancel_button).click(function() {
      console.log(this);
      console.log(this.cancel_a);
      $(this.cancel_a).click();
  });

  submit_button.cancel_button = cancel_button;


  return div;
}
