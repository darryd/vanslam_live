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
    
    var winners = round.get_winners();

    var div = get_second_round_poet_buttons(winners);


    var d = document.getElementById('poets_' + me.round_number);
    d.innerHTML = div.innerHTML;
  };
  
  var prev_round = rounds[round_number - 2].round_js;

  prev_round.add_notify_rank(contenders.get_winners, contenders);

  return contenders;
}

/*---------------------------------------------------------------------------------*/
function get_second_round_poet_buttons(winners) {

  //var result = global_rounds[1].get_winners();

  var result = winners;

  var div = document.createElement("div");
  div.id = "second_round_buttons";

  var p = document.createElement("p");
  p.innerHTML = "Select next poet.";
  div.appendChild(p);

  for (var i=0; i<result.winners.length; i++) {

    var performance = result.winners[i];

   // if (global_rounds[2]._performances.indexOf(performance) == -1) {
      var button = performance_to_button(result.winners[i]);
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
	var button = performance_to_button(result.overflow[i]);
	div2.appendChild(button);
      //}
    }
    div.appendChild(div2);
  }

  return div;
}


/*---------------------------------------------------------------------------------*/
function performance_to_button(performance) {

  var button = document.createElement("button");
  button.text = document.createTextNode(performance.name);

  button.performance = performance;
  //button.setAttribute("onClick", "add_performer_to_2nd_round(this.performance)");

  //performance.poet.notify_name.add_notify(button_name_update, button);

  button.appendChild(button.text);

  return button;
}

/*---------------------------------------------------------------------------------*/
