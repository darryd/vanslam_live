
/*----------------------------------------------------------------------------------------------------------------------------------*/
function performance_ui_new(performance) {

  var table = document.createElement("table");
  table.tr = document.createElement("tr");
  table.appendChild(table.tr);
  table.border = "1";


  var div = document.createElement("div");
  div.id = makeid(999);
  var a = create_link_to_change_name(div.id, performance);

  performance.poet.notify_name.add_notify(update_link_on_name_change, "link_change_name_" + div.id);

  div.appendChild(a);

  insert_into_table(table, div);

  table.tr = document.createElement("tr");
  table.appendChild(table.tr);

  insert_into_table(table, judges_ui_new(performance));
  insert_into_table(table, time_ui_new(performance));
  insert_into_table(table, penalty_ui_new(performance));
  insert_into_table(table, score_ui_new(performance));
  insert_into_table(table, subscore_ui_new(performance));
  insert_into_table(table, cum_score_ui_new(performance));
  insert_into_table(table, rank_ui_new(performance));


  table.tr = document.createElement("tr");
  table.appendChild(table.tr);
  insert_into_table(table, document.createTextNode("Enter scores multiplied by 10."));

  
  var p = document.createElement("p");
  insert_into_table(table, p);
  
  // Another field to show time penalty.
  var data = {p: p, performance: performance};
  performance.add_notify_score(time_penalty_update, data);
  time_penalty_update(data);

  return table;
}
/*----------------------------------------------------------------------------------------------------------------------------------*/

update_link_on_name_change = function(id) {

  var a = document.getElementById(id);
  if (a != null)
    a.innerHTML = a.performance.poet.name;
}
/*----------------------------------------------------------------------------------------------------------------------------------*/
function create_link_to_change_name(id, performance) {

  var a = document.createElement("a");
  a.id = "link_change_name_" + id;
  a.innerHTML = performance.name;
  a.setAttribute("href", "javascript:create_input_to_change_name('" + id + "'" + ", '" + performance.name + "')");
  a.performance = performance;

  return a;
}
/*----------------------------------------------------------------------------------------------------------------------------------*/
// Sometimes an input doesn't lose focus even though it should. 
// So if a new input is created, we'll remove the other ones.

function remove_inputs_that_should_have_lost_focus() {

  var inputs = document.getElementsByClassName("input_change_name");
  for (var i=0; i< inputs.length; i++)
    change_input_to_link(inputs[i].parent_id);

}


/*----------------------------------------------------------------------------------------------------------------------------------*/
function create_input_to_change_name(id, name) {

  remove_inputs_that_should_have_lost_focus();

  var performance = document.getElementById("link_change_name_" + id).performance;

  $("#link_change_name_" + id).remove();

  var input = document.createElement("input");
  input.id = "input_change_name_" + id;
  input.parent_id = id;
  input.setAttribute("class", "input_change_name");
  input.value = performance.name;
  input.performance = performance;
  input.setAttribute("onchange", "change_input_to_link('" + id + "')");
  input.setAttribute("onblur", "change_input_to_link('" + id + "')");
  input.setAttribute("onfocusout", "change_input_to_link('" + id + "')");

  $("#" + id).append(input);
}

/*----------------------------------------------------------------------------------------------------------------------------------*/
// From: http://stackoverflow.com/a/3261380
function isBlank(str) {
  return (!str || /^\s*$/.test(str));
}

/*----------------------------------------------------------------------------------------------------------------------------------*/
function change_input_to_link(id) {

  var input = document.getElementById("input_change_name_" + id);
  var name = input.value;
  var performance = input.performance;

  $("#input_change_name_" + id).remove();

  if (!isBlank(name))
    performance.poet.set_name(name);
  var a = create_link_to_change_name(id, performance);
  $("#" + id).append(a);
}

/*----------------------------------------------------------------------------------------------------------------------------------*/
// From: http://stackoverflow.com/a/1349426
function makeid(length)
{
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i < length; i++ )
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
