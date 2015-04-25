
/*-----------------------------------------------------------------------*/

// Search for strings in 'list' containing 'str' and then sorted.
// 
// If list = ["Darryl", "Darry Danzig"] and str = "Darry",
// then the new list should be sorted so that "Darry Danzig" appears
// earlier.

function subset (list, str) {

  var str_lower = str.toLowerCase();
  var new_list = [];

  for (var i=0; i<list.length; i++) {

    var match = {};
    match.item = list[i];
    match.score = score_match(list[i].toLowerCase(), str_lower);

    if (match.score != Infinity)
      new_list.push(match);
  }

  new_list.sort(function(a, b) {return a.score - b.score;});

  return new_list;
}

/*-----------------------------------------------------------------------*/

// Lower score the better.
function score_match(str, substr) {

  var score = Infinity;

  if (str.indexOf(substr) != -1)
    score = str.length;

  // Now let us see if we can match substr to a whole word in str
  // to qualify for an even better score.

  var words = str.split(/\s+/);

  for (var i=0; i<words.length; i++) 
    if (substr == words[i])
      score = substr.length;

  return score;
}

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

function add_suggestions(table, names) {

  var num_suggestions = parseInt(table.getAttribute("data-num_suggestions"));

  for (var i=0; i<names.length; i++) {

    var row = table.insertRow(-1);
    

    var cell = row.insertCell(0);
    cell.setAttribute("border", "none");
    cell.style.border = "none";
    cell.innerHTML = names[i]; //Sanitizing it sometime?
    
    row.className = "suggestion";
    cell.onmouseover = function() { this.style.backgroundColor = '#D8D8D8';};
    cell.onmouseout = function() {this.style.backgroundColor = "white";};
    cell.onclick = function() {suggest_onclick(this);};

  }

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

  if (! $.fn.mutex('set', table.id, 30))
    return false;

  data.state = "pending";
  var str = data.str;

  if((/^\s*$/).test(str)) {
    remove_suggestions(table);
    $.fn.mutex('clear', table.id);
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
	add_suggestions(table, names);

	data.state = "done";
       }
	$.fn.mutex('clear', table.id);
      };

  post_suggestions(str, xmlhttp);
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
function display_suggestions_for_str(table, str) {


  // data.state is on one three: "start", "pending", "done"

  init_suggestions(table);

  var data = {};
  data.state = "start";
  data.str = str;

  table.queue.push(data);
}

/*-----------------------------------------------------------------------*/
