
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
