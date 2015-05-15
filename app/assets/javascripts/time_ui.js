
/*----------------------------------------------------------------------------------------------------------------------------------*/

time_ui_new = function (performance) {

  var time_ui = {};
  time_ui.performance = performance;

  time_ui.input_minute = create_input(time_ui, "set_time(this.ui)"); 
  time_ui.input_second = create_input(time_ui, "set_time(this.ui)");

  var minute_table = build_input_table("minutes:", time_ui.input_minute);
  var second_table = build_input_table("seconds:", time_ui.input_second);

  var table = document.createElement("table");
  table.tr = document.createElement("tr");

  insert_into_table(table, minute_table);
  insert_into_table(table, second_table);

  /*
  var tr = document.createElement("tr");
  var p = document.createElement("p");

  table.appendChild(tr);
  tr.appendChild(p);
  */

  return table;
}
/*----------------------------------------------------------------------------------------------------------------------------------*/
function time_penalty_update(data) {

  if (data.performance.calculate_time_penalty() != 0)
    data.p.innerHTML = "Time penalty: " + data.performance.calculate_time_penalty();
  else
    data.p.innerHTML = "";
}

/*----------------------------------------------------------------------------------------------------------------------------------*/

function parse_int_or_return_zero(val) {

  var result = parseInt(val);
  if (isNaN(result))
    return 0;

  return result;
}

/*----------------------------------------------------------------------------------------------------------------------------------*/
function set_time(time_ui) {

  var minutes = parse_int_or_return_zero(time_ui.input_minute.value);
  var seconds = parse_int_or_return_zero(time_ui.input_second.value);

  time_ui.performance.set_time(minutes, seconds);
}
/*----------------------------------------------------------------------------------------------------------------------------------*/
