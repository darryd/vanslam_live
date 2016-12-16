function new_edit_round (round) {

  console.log(round);

}

function onclick_edit_round() {

  var edit_round_a = this;
  var round_number = parseInt($(this).data('round_number'));
  var round = window.rounds[round_number - 1];

  var edit_round_div = document.getElementById("edit_round_div_" + round_number); 


  var hide_a = document.createElement("a");
  hide_a.innerHTML = "Hide Round " + round_number + " Info";

  edit_round_div.appendChild(hide_a);

  var form_div = make_submit_round_info(round); // TODO Rename this
  edit_round_div.appendChild(form_div);


  $(hide_a).click(function() {
    this.remove();
    form_div.remove();
    $(edit_round_a).show();
  });

  $(this).hide();

}

// TODO Rename this.
function make_submit_round_info(round) {
  

  var row;

  row = document.createElement('div');
  row.className = "row";

  add_label_input_to_row(row, "Title", round.title);
  add_label_input_to_row(row, "Number of poets", round.num_poets);
  add_label_input_to_row(row, "Number of places", round.num_places);
  add_label_input_to_row(row, "Time limit", round.time_limit);
  add_label_input_to_row(row, "Grace period", round.grace_period);
  add_label_input_to_row(row, "Is cumulative", round.is_cumulative);
  add_label_input_to_row(row, "Previous round number", round.previous_round_number);

  var submit_button = document.createElement("button");
  submit_button.innerHTML = "Submit";
  row.appendChild(submit_button);

  $(submit_button).click(function() {
    alert("submit");
  });


  var cancel_button = document.createElement("button");
  cancel_button.innerHTML = "Cancel";
  row.appendChild(cancel_button);


  cancel_button.string = "Fredom is another word for nothing left to lose";
  $(cancel_button).click(function() {
    alert(this.string);
  });


  return row;
}

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
}
