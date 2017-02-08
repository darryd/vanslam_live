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

  row = document.createElement('div');
  row.className = "row";
  div.appendChild(row);

/*
  add_label_input_to_row(row, "Title", round.title);
  add_label_input_to_row(row, "Number of poets", round.num_poets);
  add_label_input_to_row(row, "Number of places", round.num_places);
  add_label_input_to_row(row, "Time limit", round.time_limit);
  add_label_input_to_row(row, "Grace period", round.grace_period);
  add_label_input_to_row(row, "Is cumulative", round.is_cumulative);
  add_label_input_to_row(row, "Previous round number", round.previous_round_number);
*/


  var column_title = document.createElement('div');
  column_title.className = 'small-2 columns';
  var label_title = document.createElement('label');
  label_title.innerHTML = 'Title';

  var input_title = document.createElement('input');
  input_title.value = round.title;

  row.appendChild(column_title);
  column_title.appendChild(label_title);
  label_title.appendChild(input_title);


  row = document.createElement('div');
  row.className = "row";
  div.appendChild(row);

  var submit_button = document.createElement("button");
  submit_button.innerHTML = "Submit";
  row.appendChild(submit_button);

  submit_button.round = round;
  submit_button.input_title = input_title;

  $(submit_button).click(function() {
          edit_round_request(this.round.id, this.input_title.value);

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

/*
function add_label_input_to_row (row, label_text, input_value) {

    var column = document.createElement('div');
    column.className = "small-2 columns";
    row.appendChild(column);

    var label = document.createElement('label');
    label.innerHTML = label_text;
    column.appendChild(label);

    var input = document.createElement('input');
    label.appendChild(input);
    input.value = input_value;
}*/
