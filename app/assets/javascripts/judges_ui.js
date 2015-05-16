
/*----------------------------------------------------------------------------------------------------------------------------------*/
judges_ui_new = function(performance, comm /*, num_judges*/) {

  var table = document.createElement("table");
  table.judges = [];

  var tr = document.createElement("tr");
  var td = document.createElement("td");
  td.appendChild(document.createTextNode("Judges:"));
  tr.appendChild(td);
  table.appendChild(tr);

  tr = document.createElement("tr");

  for (var i=0; i<num_judges; i++) {
    td = document.createElement("td");

    table.judges.push(judge_ui_new(performance, i, comm));
    td.appendChild(table.judges[i]);
    tr.appendChild(td);
  }
  table.appendChild(tr);
  table.border = "0";

  return table;
}
