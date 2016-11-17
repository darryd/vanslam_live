function new_edit_round (round) {

  console.log(round);

}

function onclick_edit_round() {

  var edit_round_a = this;
  var round_number = parseInt($(this).data('round_number'));
  var round = window.rounds[round_number - 1];

  var edit_round_div = document.getElementById("edit_round_div_" + round_number); 


  var hide_a = document.createElement("a");
  hide_a.innerHTML = "Hide Round Info";

  edit_round_div.appendChild(hide_a);
  

  var info_div = document.createElement("p");

  var info_str = "Number Of Poets: " + round.num_poets;
  info_str = info_str + "Is Cumulative: " + round.is_cumulative;
  info_str = info_str + " Title: " + round.title;
  info_str = info_str + " Time limit: " + round.time_limit;
  info_str = info_str + " Grace period: " + round.grace_period;
  info_str = info_str + " Previous round number: " + round.previous_round_number;

  info_div.innerHTML = info_str;

  edit_round_div.appendChild(info_div);
  $(hide_a).click(function() {
    this.remove();
    info_div.remove();
    $(edit_round_a).show();
  });

  $(this).hide();

}
