
/*----------------------------------------------------------------------------------------------------------------------------------*/

subscore_ui_new = function(performance) {

  var table = document.createElement("table");
  var tr = document.createElement("tr");
  var td = document.createElement("td");
  td.appendChild(document.createTextNode("Subscore:"));
  table.appendChild(tr);
  tr.appendChild(td);

  tr = document.createElement("tr");
  td = document.createElement("td");
  var p = document.createElement("p");
  p.innerHTML = performance.subscore;

  td.appendChild(p);
  tr.appendChild(td);
  table.appendChild(tr);

  table.border = "0";



  var data = {p: p, performance: performance};

  performance.poet.notify_score.add_notify(update_subscore_ui, data);
  update_subscore_ui(data, performance.poet);


  return table;
}


/*----------------------------------------------------------------------------------------------------------------------------------*/

function update_subscore_ui(data, poet) {

  data.p.innerHTML = Math.round(data.performance.subscore * 100) / 100;
}


/*----------------------------------------------------------------------------------------------------------------------------------*/
