/* 
 *
 * Contenders are the top poets from the previous round.
 *
 */

/*---------------------------------------------------------------------------------*/
contenders_new = function(round_number) {

  var contenders = {};

  contenders.round_number = round_number;
  // Callback function when previous round rank has been updated.
  contenders.get_winners = function(me, round) {
    
    if (!window.login_info.is_logged_in)
      return;

    var winners = round.get_winners();

    var div = get_round_buttons(winners, me.round_number);


    var d = document.getElementById('poets_' + me.round_number);
    d.innerHTML = div.innerHTML;
  };
  
  var prev_round = rounds[round_number - 2].round_js;

  prev_round.add_notify_rank(contenders.get_winners, contenders);

  return contenders;
}

/*---------------------------------------------------------------------------------*/
function get_round_buttons(winners, round_number) {

  //var result = global_rounds[1].get_winners();

  var result = winners;

  var div = document.createElement("div");
  div.id = "second_round_buttons";

  var p = document.createElement("p");
  p.innerHTML = "Select next poet.";
  div.appendChild(p);

  for (var i=0; i<result.winners.length; i++) {

    var performance = result.winners[i];

   // Check if Poet has already been slected for the round.
   // if (global_rounds[2]._performances.indexOf(performance) == -1) {
      var button = performance_to_button(result.winners[i], round_number);

      div.appendChild(button);
   // }
  }

  if (result.result != 0) {

    var div2 = document.createElement("div");
    var p = document.createTextNode("Overflow! Too many poets tied in " + places[result.result] + " place:");
    div2.appendChild(p);
    for (var i=0; i<result.overflow.length; i++) {

      var performance = result.overflow[i];
      //if (global_rounds[2]._performances.indexOf(performance) == -1) {
	var button = performance_to_button(result.overflow[i], round_number);
	div2.appendChild(button);
      //}
    }
    div.appendChild(div2);
  }

  return div;
}


/*---------------------------------------------------------------------------------*/
function performance_to_button(performance, round_number) {

  var button = document.createElement("button");
  button.name = performance.name;
  button.performance = performance;

  // This next line has no effect. 
  //button.round = rounds[round_number - 1];    // rounds[round_number - 1];
  button.setAttribute('data-round_number', round_number);

  button.text = document.createTextNode(performance.name);
  button.setAttribute("onClick", "click_poet(this)");
  button.appendChild(button.text);

  button.className = "round_" + round_number + "_" + performance.name;


  return button;
}

/*---------------------------------------------------------------------------------*/
