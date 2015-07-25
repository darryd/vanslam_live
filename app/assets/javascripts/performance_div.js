

/*----------------------------------------------------------------------------------------------------------------------------------*/
function p_div_new(performance) {

  var div = document.createElement("div");
  var name = performance.name;

  var row = document.createElement("div");
  row.className = 'row';
  var column = document.createElement('div');
  column.className = 'large-12 columns';
  column.innerHTML = "<h3> <span style='color:purple'>" + name + "</span> </h3>";
  row.appendChild(column);
  div.appendChild(row);

  div.column_length = {Judges: slam.num_judges, Time: 2, Penalty: 1, Score: 1, Subscore: 1, "Total Score": 1, Rank:1};
  div.titles = ["Judges", "Time", "Penalty", "Score", "Subscore", "Total Score", "Rank"];
  p_div_build_columns_hash(div);

  div.performance = performance;
  div.id = makeid(20);

  p_div_build_titles_row(div);
  p_div_build_sub_titles(div);
  p_div_build_data_row(div);

  div.style.backgroundColor = '#F4F4F4';
  div.style.borderStyle = 'solid';
  div.style.borderWidth = '1px';

  row = document.createElement("div");
  row.className = "row";

  column = document.createElement("div");
  column.className = "large-12 columns";
  column.style.minHeight = "15px"; //http://stackoverflow.com/a/25431669


  row.appendChild(column);
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
    column.className = "large-" + div.columns[div.titles[i]] + " columns";
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

    column.className = "large-1 columns";
    column.innerHTML = "<span style='color:purple'>" + (i + 1) + "</span>";

    row.appendChild(column);
  }
  // Add Timel
  column = document.createElement("div");
  column.className = "large-1 columns";
  column.innerHTML = "<span style='color:brown'>minutes</span>";
  row.appendChild(column);

  column = document.createElement("div");
  column.className = "large-" + (num_columns - slam.num_judges -1) + " columns";
  column.innerHTML = "<span style='color:brown'>seconds</span>";
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
  div.indexes.total_score_i = i++;
  div.indexes.rank = i;
}
/*----------------------------------------------------------------------------------------------------------------------------------*/
function p_div_get_time(div) {

  var minutes = parse_int_or_return_zero(div.data_columns[div.indexes.minutes_i].value);
  var seconds = parse_int_or_return_zero(div.data_columns[div.indexes.seconds_i].value);

  return {minutes: minutes, seconds: seconds};
}

/*----------------------------------------------------------------------------------------------------------------------------------*/
function p_div_input_entered(input) {

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
      break;
    case div.indexes.penalty_i:
      performance.set_penalty(value);
      break;
    default:
      if (i >= 0 && i < div.indexes.minutes_i) {
	input.value /= 10;
	performance.judge(i, value/10);
      }
  }
}

/*----------------------------------------------------------------------------------------------------------------------------------*/
function p_div_build_data_row(div) {

  p_div_setup_indexes(div);

  var row = document.createElement("div");
  row.className = "row";

  var num_columns = slam.num_judges + 3; // Judges + Minutes + Seconds + Penalty

  var i;
  for (i=0; i<num_columns; i++) {
    var column = document.createElement("div");
    column.className = "large-1 columns";

    var input = document.createElement("input");
    input.div = div;
    input.setAttribute('size', 4);
    input.setAttribute('onchange', 'p_div_input_entered(this)');
    input.setAttribute('data-index', i);

    column.appendChild(input);
    div.data_columns.push(input);

    row.appendChild(column);
  }

  num_columns = 12;
  for (; i< num_columns; i++) {

    var column = document.createElement("div");
    column.className = "large-1 columns";
    row.appendChild(column);

    div.data_columns.push(column);
  }

  div.appendChild(row);
}
/*----------------------------------------------------------------------------------------------------------------------------------*/


