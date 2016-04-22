

function create_round_div(round) {

 
  if (round.round_number != rounds.length + 1) {
    console.log("Error, round.round_number != rounds.length + 1");
    return;
  }

  var i = rounds.length;
  rounds.push(round);
  prepare_round(i);

/*
<div id="round_11">
    <h2> Extra Round </h2>
    <p>
    Time limit: 1:00,
    Grace period: 20  seconds
    </p>
    <div id="performances_11"></div>
    <div id="poets_11" class="poets_for_round, vwli"></div>
 </div>
 */

  var rounds_div = document.getElementById('rounds');
  var round_div = document.createElement('div');
  round_div.id = "round_" + round.round_number;
  var h2 = document.createElement('h2');
  h2.innerHTML = round.title;
  
  round_div.appendChild(h2);
  rounds_div.appendChild(round_div);

  var div = document.createElement('p');
  div.innerHTML = "Grace period: " + round.time_limit + " Grace period: " + round.grace_period;
  round_div.appendChild(div);
}


