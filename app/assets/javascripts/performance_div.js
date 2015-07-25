

/*----------------------------------------------------------------------------------------------------------------------------------*/
function performance_div_new(performance) {

  var div = document.createElement("div");
  div.structure = {"Judges": slam.num_judges, "Time": 2, "Penalty": 1, "Score": 1, "Subscore": 1, "Total Score": 1, "Rank":1};
  div.order = ["Judges", "Time", "Penalty", "Score", "Subscore", "Total Score", "Rank"];
  performance_div_build_columns_hash(div);

  div.performance = performance;
  div.id = makeid(20);
  div.className = "row";

  return div;
}

/*----------------------------------------------------------------------------------------------------------------------------------*/
function performance_div_build_columns_hash(div) {

  var num_columns = 12;

  var columns = div.columns = {};
  var titles = div.order;

  var remaining_columns = num_columns;
  for (var i=0; i<titles.length; i++) {
    columns[titles[i]] = remaining_columns;
    remaining_columns -= div.structure[titles[i]];

    if (i > 0) {
      for (j=0; j<i; j++) {
	columns[titles[j]] = div.structure[titles[j]];
      }
    }
  }
}
/*----------------------------------------------------------------------------------------------------------------------------------*/

