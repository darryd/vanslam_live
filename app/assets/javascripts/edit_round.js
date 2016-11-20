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
  

  var info_div = document.createElement("p");

  info_str = "<strong>Title: </strong>" + round.title;
  info_str = info_str + ",<strong> Number Of Poets: </strong> " + round.num_poets;
  info_str = info_str + ",<strong> Number of Places:  </strong>" + round.num_places;
  info_str = info_str + ",<strong> Title:  </strong>" + round.title;
  info_str = info_str + ",<strong> Time limit:  </strong>" + round.time_limit;
  info_str = info_str + ",<strong> Grace period:  </strong>" + round.grace_period;
  info_str = info_str + ",<strong> Is Cumulative:  </strong>" + round.is_cumulative;
  if (round.is_cumulative) 
    info_str = info_str + ",<strong> Previous round number:  </strong>" + round.previous_round_number;


  info_div.innerHTML = info_str;

  edit_round_div.appendChild(info_div);
  $(hide_a).click(function() {
    this.remove();
    info_div.remove();
    $(edit_round_a).show();
  });

  $(this).hide();

}
