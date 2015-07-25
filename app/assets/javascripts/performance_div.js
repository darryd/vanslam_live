

/*----------------------------------------------------------------------------------------------------------------------------------*/
function performance_div_new(performance) {

  var div = document.createElement("div");
  div.column_length = {"Judges": slam.num_judges, "Time": 2, "Penalty": 1, "Score": 1, "Subscore": 1, "Total Score": 1, "Rank":1};
  div.titles = ["Judges", "Time", "Penalty", "Score", "Subscore", "Total Score", "Rank"];
  performance_div_build_columns_hash(div);

  div.performance = performance;
  div.id = makeid(20);

  perf_div_build_titles_row(div);

  return div;
}

/*----------------------------------------------------------------------------------------------------------------------------------*/
function performance_div_build_columns_hash(div) {

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
function perf_div_build_titles_row(div) {

  var column;
  var row = document.createElement("div");
  row.className = "row";

  for (var i=0; i<div.titles.length; i++) {
    
    column = document.createElement("div");
    column.className = "large-" + div.columns[div.titles[i]] + " columns";
    column.innerHTML = div.titles[i];

    row.appendChild(column);

  }
  div.appendChild(row);
}
/*----------------------------------------------------------------------------------------------------------------------------------*/

