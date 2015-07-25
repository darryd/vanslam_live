

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
function p_div_build_data_row(div) {


  var row = document.createElement("div");
  row.className = "row";

  var num_columns = slam.num_judges + 3; // Judges + Minutes + Seconds + Penalty

  var i;
  for (i=0; i<num_columns; i++) {
    var column = document.createElement("div");
    column.className = "large-1 columns";

    var input = document.createElement("input");
    input.setAttribute('size', 4);

    column.appendChild(input);

    row.appendChild(column);
  }

  num_columns = 12;
  for (; i< num_columns; i++) {

    var column = document.createElement("div");
    column.className = "large-1 columns";
    row.appendChild(column);
  }

  div.appendChild(row);
}
/*----------------------------------------------------------------------------------------------------------------------------------*/


