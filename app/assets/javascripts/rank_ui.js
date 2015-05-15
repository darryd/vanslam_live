
/*----------------------------------------------------------------------------------------------------------------------------------*/

rank_ui_new = function(performance) {

  var table = document.createElement("table");
  var tr = document.createElement("tr");
  var td = document.createElement("td");
  td.appendChild(document.createTextNode("Rank:"));
  table.appendChild(tr);
  tr.appendChild(td);

  tr = document.createElement("tr");
  td = document.createElement("td");
  var p = document.createElement("p");
  p.innerHTML = performance.rank;

  td.appendChild(p);
  tr.appendChild(td);
  table.appendChild(tr);

  table.border = "0";

  performance.add_notify_rank(update_rank_ui, p);
  update_rank_ui(p, performance);

  return table;
}


/*----------------------------------------------------------------------------------------------------------------------------------*/

function update_rank_ui(p, performance) {

  p.innerHTML = performance.rank;
}


/*----------------------------------------------------------------------------------------------------------------------------------*/
