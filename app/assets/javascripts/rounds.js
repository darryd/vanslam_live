
function seconds_to_time(seconds) {


  var s = "" + seconds % 60;

  if (s.length == 1)
    s = "0" + s;

  return '' + Math.floor(seconds/60) + ':' + s; 
}

function create_round_div(round) {

 
  if (round.round_number != rounds.length + 1) {
    console.log("Error, round.round_number != rounds.length + 1");
    return;
  }

  var i = rounds.length;
  rounds.push(round);
  prepare_round(i);

// TODO <p> for time and grace has an id now

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
  h2.id = "round_title_" + round.round_number;
  h2.innerHTML = round.title;
  
  round_div.appendChild(h2);
  rounds_div.appendChild(round_div);

  var div = document.createElement('p');
  div.innerHTML = "Time limit: " + seconds_to_time(round.time_limit) + " Grace period: " + round.grace_period + " seconds";
  round_div.appendChild(div);

  div = document.createElement('div');
  div.id = "performances_" + round.round_number;
  round_div.appendChild(div);

  div = document.createElement('div');
  div.id = "poets_" + round.round_number;
  div.className = "poets_for_round, vwli";
  round_div.appendChild(div);

  invisible_round.notify_rank(); // So that the poets will appear as buttons to select
}

function generate_round_info_innerHTML(round) {
    return "Time limit: " + seconds_to_time(round.time_limit) + " Grace period: " + round.grace_period + " seconds";
}
