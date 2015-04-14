
/*-----------------------------------------------------------------------*/

function subset (list, str) {

  var new_list = [];

  for (var i=0; i<list.length; i++) {


    var s = list[i].toLowerCase();
    var substr = str.toLowerCase();

    if (s.indexOf(substr) != -1)
      new_list.push(list[i]);

  }
  return new_list;
}

/*-----------------------------------------------------------------------*/

function get_names() {

  return names = get_json('/poet/names/').names;
}
/*-----------------------------------------------------------------------*/
