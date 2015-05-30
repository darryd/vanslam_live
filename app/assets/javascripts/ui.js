

/*----------------------------------------------------------------------------------------------------------------------------------*/
function create_input(ui, onchange) {

  var input = document.createElement("input");
  input.style.width = "50px";
  input.type = "number";
  //input.value = "0";
  input.ui = ui;
  input.setAttribute("onchange", onchange);
  input.className =  "scorekeeper_input";


  if (!login_info.is_logged_in)
    input.setAttribute('readonly', null);

  return input;
}
/*----------------------------------------------------------------------------------------------------------------------------------*/
function insert_into_table(table, input_table) {

  var td = document.createElement("td");
  td.appendChild(input_table);
  table.tr.appendChild(td);
  table.appendChild(table.tr);
}
/*----------------------------------------------------------------------------------------------------------------------------------*/


function build_input_table(label, input) {

  var table = document.createElement("table");
  var tr = document.createElement("tr");
  var td = document.createElement("td");
  td.appendChild(document.createTextNode(label));
  tr.appendChild(td);
  table.appendChild(tr);

  tr = document.createElement("tr");
  td = document.createElement("td");
  td.appendChild(input);
  tr.appendChild(td);
  table.appendChild(tr);

  return table;
}

/*----------------------------------------------------------------------------------------------------------------------------------*/
