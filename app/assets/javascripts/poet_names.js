
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

  var limit = 5;

  var AUTH_TOKEN = $('meta[name=csrf-token]').attr('content');

  var name = encodeURIComponent(name);
  var authenticity = encodeURIComponent(AUTH_TOKEN);

  var data = "authenticity_token="+authenticity+"&name="+name+"&limit="+limit;

  xmlhttp.open("POST", "/poet/post_suggestions", true);
  xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  xmlhttp.send(data);

  //return jQuery.parseJSON(xmlhttp.responseText);
}

/*-----------------------------------------------------------------------*/

function add_suggestions(table, names) {

  // DEBUG  
  if (names === undefined) { // Why is this happening?
    return;
  }


  var num_suggestions = parseInt(table.getAttribute("data-num_suggestions"));

  for (var i=0; i<names.length; i++) {

    row = table.insertRow(-1);
    row.className = "suggestion";
    row.innerHTML = names[i]; //Sanitizing it sometime?

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

function display_suggestions_for_str(table, str) {

  if (! $.fn.mutex('set', 'addsuggestion', 30))
    return;

  if((/^\s*$/).test(str)) {
    remove_suggestions(table);
    $.fn.mutex('clear', 'addsuggestion');
    return;
  }

  var xmlhttp = get_xmlhttp();
  
  xmlhttp.onreadystatechange = function() 
      {
       if (xmlhttp.readyState==4 && xmlhttp.status==200) {
	remove_suggestions(table);

        var names =  jQuery.parseJSON(xmlhttp.responseText).names;
        console.log(names);
	add_suggestions(table, names);
       };
	$.fn.mutex('clear', 'addsuggestion');
      };

  post_suggestions(str, xmlhttp);
}
/*-----------------------------------------------------------------------*/



