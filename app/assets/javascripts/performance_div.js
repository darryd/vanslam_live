var NUM_COLUMNS = 12;

/*----------------------------------------------------------------------------------------------------------------------------------*/
function p_div_new(performance) {

  var div = document.createElement("div");
  div.id = makeid(20);
  var name = performance.name;

  div.comm = comm_new(div, performance.name); //Create comm object for communictiation with the server. 
  performance.comm = div.comm;

  performance.add_notify_rank(p_div_rank_updated, div);
  performance.add_notify_score(p_div_score_updated, div);

  var row = document.createElement("div");
  row.className = 'row';
  var column = document.createElement('div');
  column.className = 'small-11 columns';
  column.innerHTML = "<h3> <span style='color:purple'>" + name + "</span> </h3>";
  row.appendChild(column);

  
  var column = document.createElement("div");
  column.className = 'small-2 columns';

  var remove_me = make_remove_me_div(div.id);
  column.appendChild(remove_me);
  row.appendChild(column);

  div.appendChild(row);



  div.column_length = {Judges: slam.num_judges, Time: 2, Penalty: 1};
  div.titles = ["Judges", "Time", "Penalty"];
  p_div_build_columns_hash(div);

  div.performance = performance;

  p_div_build_titles_row(div);
  p_div_build_sub_titles(div);
  p_div_build_data_row(div);
  p_div_build_footers(div);

  div.style.backgroundColor = '#F4F4F4';
  div.style.borderStyle = 'solid';
  div.style.borderWidth = '1px';

  row = document.createElement("div");
  row.className = "row";

  /*
  column = document.createElement("div");
  column.className = "small-12 columns";
  column.style.minHeight = "15px"; //http://stackoverflow.com/a/25431669

  row.appendChild(column);
  div.appendChild(row);
  */

  row = document.createElement("div");
  row.className = "row";

  column = document.createElement("div");
  column.className = "small-2 medium-1 columns";
  column.style.color = "blue";
  column.innerHTML = "<p> Score: </p>";
  row.appendChild(column);

  div.score_column = document.createElement("div");
  div.score_column.className = "small-2 medium-1 columns";
  div.score_column.innerHTML = "";
  row.appendChild(div.score_column);


  if (div.performance.prev != null) {

    column = document.createElement("div");
    column.className = "small-2 medium-1 columns";
    column.style.color = "blue";
    column.innerHTML = "<p> Total: </p>";
    row.appendChild(column);

    div.cumulative_column = document.createElement("div");
    div.cumulative_column.className = "small-2 medium-1 columns";
    div.cumulative_column.innerHTML = "";
    row.appendChild(div.cumulative_column);

  }

  column = document.createElement("div");
  column.className = "small-2 medium-1 columns";
  column.style.color = "blue";
  column.innerHTML = "<p> Rank: </p>";
  row.appendChild(column);

  div.rank_column = document.createElement("div");
  div.rank_column.className = "small-2 medium-1 columns end";
  div.rank_column.innerHTML = "";
  row.appendChild(div.rank_column);

  div.appendChild(row);

  row = document.createElement("div");
  row.className = "row";

  div.tied_with = document.createElement("div");
  div.tied_with.className = "small-12 columns";
  row.appendChild(div.tied_with);
  div.appendChild(row);

  return div;
}

/*----------------------------------------------------------------------------------------------------------------------------------*/
function p_div_build_columns_hash(div) {

  var num_columns = 12;

  var columns = div.columns = {};
  var titles = div.titles;

  var remaining_columns = num_columns;
  for (var i=0; i<titles.length; i++) {
    columns[titles[i]] = remaining_columns;
    remaining_columns -= div.column_length[titles[i]];

    if (i > 0) {
      for (j=0; j<i; j++) {
	columns[titles[j]] = div.column_length[titles[j]];
      }
    }
  }
}
/*----------------------------------------------------------------------------------------------------------------------------------*/
function p_div_build_titles_row(div) {

  var row = document.createElement("div");
  row.className = "row";

  for (var i=0; i<div.titles.length; i++) {

    var column = document.createElement("div");
    column.className = "small-" + div.columns[div.titles[i]] + " columns";

    column.innerHTML = "<span style='color:blue;'>" + div.titles[i] + "</span>";

    row.appendChild(column);

  }
  div.appendChild(row);
}
/*----------------------------------------------------------------------------------------------------------------------------------*/
function p_div_build_sub_titles(div) {

  var num_columns = 12;

  var row = document.createElement("div");
  row.className = "row";

  // Add Judges
  var column;
  for (var i=0; i<slam.num_judges; i++) {

    column = document.createElement("div");

    column.className = "small-1 columns";
    column.innerHTML = "<span style='color:purple'>" + (i + 1) + "</span>";

    row.appendChild(column);
  }
  // Add Time
  column = document.createElement("div");
  column.className = "small-1 columns";
  column.innerHTML = "<span style='color:brown'>m</span>";
  row.appendChild(column);

  column = document.createElement("div");
  column.className = "small-1 columns end";
  column.innerHTML = "<span style='color:brown'>s</span>";
  row.appendChild(column);

  div.appendChild(row);
}

/*----------------------------------------------------------------------------------------------------------------------------------*/
function p_div_setup_indexes(div) {

  div.data_columns = [];
  div.indexes = {};

  var i = slam.num_judges;

  div.indexes.minutes_i = i++;
  div.indexes.seconds_i = i++;
  div.indexes.penalty_i = i++;
  div.indexes.score_i = i++;
  div.indexes.subscore_i = i++;
  div.indexes.rank = i;
}
/*----------------------------------------------------------------------------------------------------------------------------------*/
function format_value(value) {

  // Return a value that has at most one decimal place.
  return Math.round(value * 100) / 100;
}
/*----------------------------------------------------------------------------------------------------------------------------------*/
function p_div_update_data_column(div, index, value) {
  div.data_columns[index].innerHTML = format_value(value);

  // Why bother displaying subscore when it equals score?
  if (div.performance.prev == null)
    div.data_columns[div.indexes.subscore_i].innerHTML = '';
}

/*----------------------------------------------------------------------------------------------------------------------------------*/
function p_div_score_updated(div, performance) {


  //p_div_update_data_column(div, div.indexes.score_i, performance.score);
  //p_div_update_data_column(div, div.indexes.subscore_i, performance.subscore);


  div.score_column.innerHTML = format_value(performance.score);

  if (div.performance.prev != null) 
    div.cumulative_column.innerHTML = format_value(performance.subscore);




  var min_i = performance.min_judge;
  var max_i = performance.max_judge;

  if (slam.do_not_include_min_and_max_scores) {
    for (var i=0; i<slam.num_judges; i++) {
      div.footers[i].innerHTML = "<p></p>";
      div.data_columns[i].style.color = "black";
    }

    var min_max_color = "darkviolet";

    var low_str = "<p class='visible-for-small-only'>L</p><p class='visible-for-medium-up'>LOW</p>";
    var high_str = "<p class='visible-for-small-only'>H</p><p class='visible-for-medium-up'>HIGH</p>";

    div.data_columns[min_i].style.color = min_max_color;
    div.data_columns[max_i].style.color = min_max_color;

    div.footers[min_i].innerHTML = low_str;
    div.footers[min_i].style.color = min_max_color;

    div.footers[max_i].innerHTML = high_str;
    div.footers[max_i].style.color = min_max_color;
  }
  // Time Penalty

  var time_penalty = performance.calculate_time_penalty() * -1;
  if (time_penalty != 0){
    div.footers[slam.num_judges].innerHTML = "P:";
    div.footers[slam.num_judges].style.color = "green";
    div.footers[slam.num_judges + 1].innerHTML = time_penalty;
    div.footers[slam.num_judges + 1].style.color = "green";
  } 
  else {
    div.footers[slam.num_judges].innerHTML = "<p></p>";
    div.footers[slam.num_judges + 1].innerHTML = "<p></p>";
  }
}
/*----------------------------------------------------------------------------------------------------------------------------------*/
function p_div_rank_updated (div, performance) {

  div.rank_column.innerHTML = performance.rank;

  div.tied_with.innerHTML = performance.is_tied ? "<p> <span style='color:blue'> Tied With: </span> " + performance.names_tied_with.join() + "</p>" : "";
}
/*----------------------------------------------------------------------------------------------------------------------------------*/
function p_div_get_time(div) {

  var minutes = parse_int_or_return_zero(div.data_columns[div.indexes.minutes_i].value);
  var seconds = parse_int_or_return_zero(div.data_columns[div.indexes.seconds_i].value);

  return {minutes: minutes, seconds: seconds};
}

/*----------------------------------------------------------------------------------------------------------------------------------*/
function is_score_entered_fully(score) {


  if (score == "10")
    return false;

  if (score == "100")
    return true;


  if (score.length == 2)
    return true;

  return false;
}

/*----------------------------------------------------------------------------------------------------------------------------------*/

function p_div_input_onkeyup(inputs, input) {

  input.value = input.value.replace('\.', '');
  var index = parseInt(input.getAttribute('data-index'));

  if (is_score_entered_fully(input.value)) {


    if (index < inputs.length - 1)  {
      input.removeAttribute('onkeyup');
      next_input = inputs[index + 1];
      next_input.focus();
    }
    else {
      $(input).trigger("change");
      input.blur();
    }
  }
}

/*----------------------------------------------------------------------------------------------------------------------------------*/
function p_div_input_entered(input) {

  if (!login_info.is_logged_in)
    return;

  var i = parseInt(input.getAttribute('data-index'));
  var div = input.div;
  var performance = div.performance;

  var value = parse_float_or_return_zero(input.value);

  switch (i) 
  {
    case div.indexes.minutes_i:
    case div.indexes.seconds_i:
      var time = p_div_get_time(div);
      performance.set_time(time.minutes, time.seconds);
      set_time_request(performance.comm, time.minutes, time.seconds);
      break;
    case div.indexes.penalty_i:
      performance.set_penalty(value);
      set_penalty_request(performance.comm, value);
      break;
    default:
      if (i >= 0 && i < div.indexes.minutes_i) {
	input.value = input.value.replace('\.', '');
	var value = input.value / 10;
	input.value = value;
	performance.judge(i, value);
	judge_request(performance.comm, i, value);
      }
  }
}

/*----------------------------------------------------------------------------------------------------------------------------------*/
function p_div_set_score(p_div, judge_i, value) {

  p_div.data_columns[judge_i].value = value;
  p_div.data_columns[judge_i].removeAttribute('onkeyup');
  p_div.performance.judge(judge_i, value);
}

/*----------------------------------------------------------------------------------------------------------------------------------*/
function p_div_set_time(p_div, minutes, seconds) {

  var i = p_div.indexes.minutes_i;

  p_div.data_columns[i].value = minutes;
  p_div.data_columns[++i].value = seconds;

  p_div.performance.set_time(minutes, seconds);
}

/*----------------------------------------------------------------------------------------------------------------------------------*/
function p_div_set_penalty(p_div, value) {

  var i = p_div.indexes.penalty_i;

  p_div.data_columns[i].value = value;

  p_div.performance.set_penalty(value);
}
/*----------------------------------------------------------------------------------------------------------------------------------*/
function p_div_build_data_row(div) {

  p_div_setup_indexes(div);

  var row = document.createElement("div");
  row.className = "row";

  var num_columns = slam.num_judges + 3; // Judges + Minutes + Seconds + Penalty

  var i;

  div.judge_inputs = [];


  for (i=0; i<num_columns; i++) {
    var column = document.createElement("div");
    column.className = "small-1 columns";

    var input = document.createElement("input");
    input.inputs = div.judge_inputs;

    // This (the if statement to follow) is to faciliate automatic refocusing of the next judge
    // after two digit are entered for the score (exception 10 and 100)
    // The last input will be Minutes so that the last judge 
    // (the one that comes before Minutes) will have another input to 
    // focus on after the score has been entered.
    if (i <= slam.num_judges)
      div.judge_inputs.push(input);

    input.div = div;
    input.className =  "scorekeeper_input";
    input.setAttribute('size', 4);
    input.setAttribute('onchange', 'p_div_input_entered(this)');

    if (i < slam.num_judges)
      // Only do this for inputs that are judges
      input.setAttribute('onkeyup', 'p_div_input_onkeyup(this.inputs, this)');

    input.setAttribute('data-index', i);
    input.type = "number";
    input.style.width = "60px";

    if (!login_info.is_logged_in)
      input.setAttribute('readonly', null);

    column.appendChild(input);
    div.data_columns.push(input);

    row.appendChild(column);
  }

  num_columns = 12;
  for (; i< num_columns; i++) {

    var column = document.createElement("div");
    column.className = "small-1 columns";
    row.appendChild(column);

    div.data_columns.push(column);
  }

  div.appendChild(row);
}
/*----------------------------------------------------------------------------------------------------------------------------------*/
function p_div_build_footers(div) {

  div.footers = [];

  var num_columns = 12;
  var row = document.createElement("div");
  row.className = "row";

  for (var i=0; i<num_columns; i++) {

    var column = document.createElement("div");
    column.className = "small-1 columns";
    column.innerHTML = "<p></p>"; 

    row.appendChild(column);
    div.footers.push(column);
  }

  div.appendChild(row);
}
/*----------------------------------------------------------------------------------------------------------------------------------*/


