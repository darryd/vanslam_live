
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

  return names = get_json('/poet/names/').names;
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

function post_suggestions(name) {

  var limit = 5;

  var xmlhttp = get_xmlhttp();
  var AUTH_TOKEN = $('meta[name=csrf-token]').attr('content');

  var name = encodeURIComponent(name);
  var authenticity = encodeURIComponent(AUTH_TOKEN);

  var data = "authenticity_token="+authenticity+"&name="+name+"&limit="+limit;

  xmlhttp.open("POST", "/poet/post_suggestions", false);
  xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  xmlhttp.send(data);

  return jQuery.parseJSON(xmlhttp.responseText);
}

/*-----------------------------------------------------------------------*/
