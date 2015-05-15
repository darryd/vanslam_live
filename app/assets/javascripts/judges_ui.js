
/*----------------------------------------------------------------------------------------------------------------------------------*/
judges_ui_new = function(performance /*, num_judges*/) {

  var table = document.createElement("table");
  var tr = document.createElement("tr");
  var td = document.createElement("td");
  td.appendChild(document.createTextNode("Judges:"));
  tr.appendChild(td);
  table.appendChild(tr);

  tr = document.createElement("tr");

  for (var i=0; i<num_judges; i++) {
    td = document.createElement("td");
    td.appendChild(judge_ui_new(performance, i));
    tr.appendChild(td);
  }
  table.appendChild(tr);
  table.border = "0";

  return table;
}
