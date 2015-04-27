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

  var data = "authenticity_token="+authenticity+"&name="+name

  xmlhttp.open("POST", "/poet/post_create_or_get", false);
  xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  xmlhttp.send(data);

  return jQuery.parseJSON(xmlhttp.responseText);
}

/*-----------------------------------------------------------------------*/

function post_suggestions(name, xmlhttp) {

  var limit = 50;

  var AUTH_TOKEN = $('meta[name=csrf-token]').attr('content');

  var name = encodeURIComponent(name);
  var authenticity = encodeURIComponent(AUTH_TOKEN);

  var data = "authenticity_token="+authenticity+"&name="+name+"&limit="+limit;

  xmlhttp.open("POST", "/poet/post_suggestions", true);
  xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  xmlhttp.send(data);
}

/*-----------------------------------------------------------------------*/

function suggest_onclick(cell) {

  var input_id = $(cell).parents('table').attr('id') + '_input';
  var input = document.getElementById(input_id);

  input.value = cell.innerHTML;
  remove_suggestions(document.getElementById($(cell).parents('table').attr('id')));
}

/*-----------------------------------------------------------------------*/

function handle_onmouseover_cell(cell) {
  
  var table_id = $(cell).parents('table').attr('id');
  var table = document.getElementById(table_id);
  if (cell.index == table.index)
    return;

  for (var i=0; i<table.cells.length; i++)
    handle_onmouseout_cell(table.cells[i]);

  cell.original_color = cell.style.backgroundColor;
  cell.style.backgroundColor = '#D8D8D8';

  table.index = cell.index;
}

/*-----------------------------------------------------------------------*/

function handle_onmouseout_cell(cell) {

  var table_id = $(cell).parents('table').attr('id');
  var table = document.getElementById(table_id);
  table.index = -1;

  cell.style.backgroundColor = cell.original_color;
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
    cell.index = i;
    cell.setAttribute("border", "none");
    cell.style.border = "none";
    cell.innerHTML = names[i]; //Sanitizing it sometime?

    row.className = "suggestion";
    cell.onmouseover = function() {handle_onmouseover_cell(this);};
    cell.onmouseout = function() {handle_onmouseout_cell(this);};
    cell.onclick = function() {suggest_onclick(this);};

    if (name.replace(/\s+/g, ' ').trim().toLowerCase() == names[i].toLowerCase()) {
      cell.style.backgroundColor = "#C6AEC7";
      table.is_poet_in_database = true;
    }

  }

  var num_suggestions = parseInt(table.getAttribute("data-num_suggestions"));
  num_suggestions += names.length;
  table.setAttribute("data-num_suggestions", num_suggestions);

}
/*-----------------------------------------------------------------------*/

function remove_suggestions(table) {

  var num_suggestions = parseInt(table.getAttribute("data-num_suggestions"));


  for (var i=0; i<num_suggestions; i++)
    table.deleteRow(-1)


      table.setAttribute("data-num_suggestions", 0);
}
/*-----------------------------------------------------------------------*/

// Get suggestions from the server and display the suggestions.
function get_suggestions_from_server(table, data) {

  data.state = "pending";
  var name = data.name;

  if((/^\s*$/).test(name)) {
    remove_suggestions(table);
    data.state = "done";
    return true;
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

  post_suggestions(name, xmlhttp);
  return true;
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
function process_queue(table) {

  if (table.queue.length >0 && table.queue[0].state == "pending")
    return;

  if (table.queue.length > 0 && table.queue[0].state == "done")
    table.queue.splice(0,1);

  if (table.queue.length > 0 && table.queue[0].state == "start") {

    if (table.queue.length > 1)
      table.queue.splice(0, table.queue.length - 1); // We can ignore all but the last item on the queue

    get_suggestions_from_server(table, table.queue[0]);
  }
}

/*-----------------------------------------------------------------------*/
function display_suggestions_for_name(table, name) {


  if (window.event.keyCode >= 37 && window.event.keyCode <= 40 || window.event.keyCode == 13)
    return;

  // data.state is on one three: "start", "pending", "done"
  init_suggestions(table);

  var data = {};
  data.state = "start";
  data.name = name;

  table.queue.push(data);

  console.log(window.event.keyCode);
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
	handle_onmouseover_cell(cell);
      }
      break;
    case 40: // Down Arrow

      if (table.index < table.cells.length -1) {
	var cell = table.cells[table.index + 1];
	handle_onmouseover_cell(cell);
      }
      break;
    case 13: //Enter
      var cell = table.cells[table.index];
      suggest_onclick(cell);
      break;
  }
}
/*-----------------------------------------------------------------------*/
