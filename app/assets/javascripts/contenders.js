/* 
 *
 * Contenders are the top poets from the previous round.
 *
 */

/*---------------------------------------------------------------------------------*/
contenders_new = function(round_number, prev_round) {

  var contenders = {};

  contenders.prev_round = prev_round;

  

  contenders.round_number = round_number;
  // Callback function when previous round rank has been updated.
  contenders.get_winners = function(me, round) {

    
    
    if (!window.login_info.is_logged_in)
      return;

    var winners = me.prev_round.get_winners();

    var div = get_round_buttons(winners, me.round_number);

    // Replace the div with the new div.
    var id = makeid(10);
    div.id = id;
    $('#poets_' + me.round_number).replaceWith(div);
    var d = document.getElementById(id)
    d.setAttribute('id', 'poets_' + me.round_number);

  };
  
  contenders.prev_round.add_notify_rank(contenders.get_winners, contenders);
  return contenders;
}

/*---------------------------------------------------------------------------------*/
function get_round_buttons(winners, round_number) {

  var result = winners;
  var round = rounds[round_number - 1];

  var div = document.createElement("div");
  div.className = 'visible_when_logged_in';

  var p = document.createElement("p");
  p.innerHTML = "Select next poet.";
  div.appendChild(p);

  for (var i=0; i<result.winners.length; i++) {

    var performance = result.winners[i];

      var button = performance_to_button(result.winners[i], round_number);

      if (round.names_already_performing.indexOf(performance.name) == -1 )
	div.appendChild(button);
  }

  if (result.result != 0) {

    var div2 = document.createElement("div");
    var p = document.createTextNode("Overflow! Too many poets tied in " + places[result.result] + " place:");
    div2.appendChild(p);
    for (var i=0; i<result.overflow.length; i++) {

      var performance = result.overflow[i];
      var button = performance_to_button(result.overflow[i], round_number);

      if (round.names_already_performing.indexOf(performance.name) == -1 )
	div2.appendChild(button);
    }
    div.appendChild(div2);
  }

  return div;
}


/*---------------------------------------------------------------------------------*/
function performance_to_button(performance, round_number) {

  var button = document.createElement("button");
  button.name = performance.name;
  button.performance = performance; // BOOKMARK	
  button.prev_performance = performance;
  button.round = rounds[round_number - 1];

  button.text = document.createTextNode(performance.name);
  button.setAttribute("onClick", "click_poet(this)");
  button.appendChild(button.text);

  button.className = performance.name + performance.id;


  return button;
}

/*---------------------------------------------------------------------------------*/
