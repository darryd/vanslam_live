/*-----------------------------------------------------------------------*/

function get_names() {

  return get_json('/poet/names/').names;
}
/*-----------------------------------------------------------------------*/

function post_create_or_get(name) {

  var xmlhttp = get_xmlhttp();
  var AUTH_TOKEN = $('meta[name=csrf-token]').attr('content');

  var name = encodeURIComponent(name);
  var authenticity = encodeURIComponent(AUTH_TOKEN);

  var data = "authenticity_token="+authenticity+"&name="+name;

  xmlhttp.open("POST", "/poet/post_create_or_get", false);
  xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  xmlhttp.send(data);

  return jQuery.parseJSON(xmlhttp.responseText);
}

/*-----------------------------------------------------------------------*/
function post_async(xmlhttp, url, params) {

  var data = "authenticity_token=" + encodeURIComponent($('meta[name=csrf-token]').attr('content'));
  var keys = _.keys(params);

  for (var i=0; i<keys.length; i++)
    data += "&" + keys[i] + "=" + encodeURIComponent(params[keys[i]]);

  xmlhttp.open("POST", url, true);
  xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  xmlhttp.send(data);
}
/*-----------------------------------------------------------------------*/

/* This is when the scorekeeper clicks on enters on a suggestion.
 */
function suggest_onclick(cell) {

  var input_id = $(cell).parents('table').attr('id') + '_input';
  var input = document.getElementById(input_id);

  input.value = cell.innerHTML;

  var table = document.getElementById($(cell).parents('table').attr('id'));

  remove_suggestions(table);
  table.is_poet_in_database = true;
  display_whether_in_database(table, input.value);
  
  // This is the variable that the select button uses.
  table.name_as_stored_in_database = input.value;
}

/*-----------------------------------------------------------------------*/
function init_poet_lookup() {
 
  display_suggestions_for_name(document.getElementById('suggestions'), "");
  document.getElementById('suggestions_input').value = "";
  document.getElementById('suggestions_input').focus();

}

/*-----------------------------------------------------------------------*/

function select_cell(cell) {

  var table_id = $(cell).parents('table').attr('id');
  var table = document.getElementById(table_id);
  if (cell.index == table.index)
    return;

  for (var i=0; i<table.cells.length; i++)
    unselect_cell(table.cells[i]);

  cell.original_color = cell.style.backgroundColor;
  cell.style.color = "white";
  cell.style.backgroundColor = '#BD4042';
  cell.style.backgroundColor = 'purple';

  table.index = cell.index;
}

/*-----------------------------------------------------------------------*/

function unselect_cell(cell) {

  try {
    var table_id = $(cell).parents('table').attr('id');
    var table = document.getElementById(table_id);
    table.index = -1;

  }catch(e) {}
    cell.style.backgroundColor = cell.original_color;
    cell.style.color = "black";
}

/*-----------------------------------------------------------------------*/

function clear_suggestions_data(table) {

  table.is_poet_in_database = false;
  table.index = -1;
  table.cells = [];
}


/*-----------------------------------------------------------------------*/

function add_suggestions(table, names, name) {

  clear_suggestions_data(table);

  for (var i=0; i<names.length; i++) {

    var row = table.insertRow(-1);

    var cell = row.insertCell(0);
    table.cells.push(cell);
    cell.className = "suggestion";
    cell.index = i;
    //cell.style.border = "none";
    cell.innerHTML = names[i]; //Sanitizing it sometime?

    row.className = "suggestion";
    cell.onmouseover = function() {select_cell(this);};
    cell.onmouseout = function() {unselect_cell(this);};
    cell.onclick = function() {suggest_onclick(this);};

    if (name.replace(/\s+/g, ' ').trim().toLowerCase() == names[i].toLowerCase()) {
      cell.style.backgroundColor = "#C6AEC7";
      table.is_poet_in_database = true;

      // We'll save the name as it is in the database so that when we press the select button
      // we have the name as it is saved in the database
      // (not as the scorekeeper entered it (perhaps the scorekeeper entered the name in all lowercase.
      // 'jane instead of 'Jane').
      table.name_as_stored_in_database = names[i];

    }

  }
}
/*-----------------------------------------------------------------------*/

function remove_suggestions(table) {

  var num_suggestions;

  try {
    num_suggestions = table.cells.length;
  }
  catch (e) {
    num_suggestions = 0;
  } 

  for (var i=0; i<num_suggestions; i++)
    table.deleteRow(-1);

  table.cells = [];
  table.index = -1;
}
/*-----------------------------------------------------------------------*/

// Get suggestions from the server and display the suggestions.
function get_suggestions_from_server(table, data) {

  data.state = "pending";
  var name = data.name;

  if((/^\s*$/).test(name)) {
    remove_suggestions(table);
    data.state = "done";
    return;
  }

  var xmlhttp = get_xmlhttp();

  xmlhttp.onreadystatechange = function() 
  {
    if (xmlhttp.readyState==4 && xmlhttp.status==200) {
      remove_suggestions(table);

      var names =  jQuery.parseJSON(xmlhttp.responseText).names;
      console.log(names);
      add_suggestions(table, names, name);

      data.state = "done";
    }
  };
  xmlhttp.onerror = function () { data.state = "start"; }; // reset try again later

  post_async(xmlhttp, "/poet/post_suggestions", {name: name, limit: 50});
  return;
}
/*-----------------------------------------------------------------------*/

function init_suggestions(table) {

  if (table.queue === undefined) {
    table.queue = [];
    var interval = 10;
    setInterval(process_queue, interval, table);
  }
}

/*-----------------------------------------------------------------------*/
function enable_button(button) {

  button.removeAttribute('disabled');
  button.innerHTML = "<span style='font-weight:bold;'>" + button.getAttribute('data-str') 
    + "</span>";
}
/*-----------------------------------------------------------------------*/
function disable_button(button) {

  button.setAttribute('disabled', null);
  button.innerHTML = button.getAttribute('data-str');
}

/*-----------------------------------------------------------------------*/
/* Displays a message to the user to tell the user whether the name in 
 * the input box is in the database. 
 */
function display_whether_in_database(table, name) {

  var select_button = document.getElementById(table.id + "_select");
  var create_button = document.getElementById(table.id + "_create");
  var max_length = 20;

  message_div = document.getElementById(table.id + '_message');

  if ((/^\s*$/).test(name)) {
    
    disable_button(select_button);
    disable_button(create_button);

    message_div.innerHTML = '';
    return;
  }

  if (table.is_poet_in_database) {

    enable_button(select_button);
    disable_button(create_button);


    message_div.innerHTML = "<p style='color:black;'>" 
      + "<span style='font-weight:bold'>Poet </span>"
      + "<span style='color:purple;font-weight:bold'>" 
      //+ wordWrap("poet+" + name, max_length).substring("poet+".length)
      + name
      + "</span></br>"
      + "Is in database."
      + "</p>"
  }
  else
  {

    disable_button(select_button);
    enable_button(create_button);

    message_div.innerHTML = "<p style='color:black;'>" 
      + "<span style='font-weight:bold'>Poet </span>"
      + "<span style='color:purple;font-weight:bold'>" 
      //+ wordWrap("poet+" + name, max_length).substring("poet+".length)
      + name
      + "</span></br>"
      + "Is <span style='color:red;font-weight:bold'>not</span>"
      + " in database."
      + "</p>";
  }
}
/*-----------------------------------------------------------------------*/
function click_create() {

  var table = document.getElementById("suggestions");
  var input = document.getElementById("suggestions_input");
  var name = input.value;

  var xmlhttp = get_xmlhttp();
  xmlhttp.onreadystatechange = function()
  {
    if (xmlhttp.readyState==4 && xmlhttp.status==200) {

      var result = jQuery.parseJSON(xmlhttp.responseText);
      if (!result.result)
	alert(result.message);
      else {
	input.value = result.poet.name;
	display_suggestions_for_name(table, name);
      }
    }
  };

  post_async(xmlhttp, "/poet/post_create_or_get", {name: name});


}
/*-----------------------------------------------------------------------*/
function process_queue(table) {

  if (table.queue.length > 0 && table.queue[0].state == "pending")
    return;

  if (table.queue.length > 0 && table.queue[0].state == "done") {
    console.log("Done lookup for " + table.queue[0].name);
    display_whether_in_database(table, table.queue[0].name);
    table.queue.splice(0,1);
  }

  if (table.queue.length > 0 && table.queue[0].state == "start") {

    if (table.queue.length > 1)
      table.queue.splice(0, table.queue.length - 1); // We can ignore all but the last item on the queue

    get_suggestions_from_server(table, table.queue[0]);
  }
}

/*-----------------------------------------------------------------------*/
function display_suggestions_for_name(table, name) {


  if (window.event != undefined)
    if (window.event.keyCode >= 37 && window.event.keyCode <= 40 || window.event.keyCode == 13)
      return;

  // data.state is on one three: "start", "pending", "done"
  init_suggestions(table);

  var data = {};
  data.state = "start";
  data.name = name;

  table.queue.push(data);
}

/*-----------------------------------------------------------------------*/

function handle_onfocus(input) {

  window.suggestion_table = document.getElementById($(input).parents('table').attr('id'));
  window.original_onkeydown = document.onkeydown;

  document.onkeydown = function() {

    if (window.original_onkeydown != null)
      window.original_onkeydown();

    onkeydown();
  };
}

/*-----------------------------------------------------------------------*/
function handle_onblur(input) {

  document.onkeydown = window.original_onkeydown;
  window.suggestion_table = null;

}
/*-----------------------------------------------------------------------*/

function onkeydown() {

  var table = window.suggestion_table;

  switch (window.event.keyCode) {

    case 38: // Up Arrow

      if (table.index > 0) {
	var cell = table.cells[table.index -1];
	select_cell(cell);
      }
      break;
    case 40: // Down Arrow

      if (table.index < table.cells.length -1) {
	var cell = table.cells[table.index + 1];
	select_cell(cell);
      }
      break;
    case 13: //Enter
      var cell = table.cells[table.index];
      suggest_onclick(cell);
      break;
  }
}

/*-----------------------------------------------------------------------*/

//window.show_keyCode = true;
document.onkeydown = function () {

  if (window.show_keyCode)
    console.log("keyCode = " + window.event.keyCode);

  // Only caputuring Alt Keys
  if (!window.event.altKey)
    return;

  switch (window.event.keyCode) {

    case 65: // Alt A (Add Poet)
      if (document.getElementById('poet_lookup').clientWidth == 0)
	  $('#add_poet').click();
      break;

    case 83: // Alt-S (Select)
      // Click the button if poet_lookup is not active and select button is enabled.
      if (document.getElementById('poet_lookup').clientWidth != 0)
	if ($("#suggestions_select").is(":enabled"))
	  $('#suggestions_select').click();
      break;

    case 67: // Alt-C (Create)
      if (document.getElementById('poet_lookup').clientWidth != 0)
	if ($("#suggestions_create").is(":enabled"))
	  $('#suggestions_create').click();
      break;

    case 77: // Alt-M (Minimize)
      if (document.getElementById('poet_lookup').clientWidth != 0)
	if ($("#poet_lookup_cancel").is(":enabled"))
	  $('#poet_lookup_cancel').click();
      break;

  }
}
/*-----------------------------------------------------------------------*/
