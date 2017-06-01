
crazy = (function() {

/*---------------------------------------------------------------------------------------------*/

function shuffle(str) {

  var shuffled_str = "";
  var indexes = [];

  for (var i=0; i<str.length; i++) 
    indexes.push(i);

  while (indexes.length > 0) {
   
    var i = Math.floor(Math.random() * indexes.length);
    var str_i = indexes.splice(i, 1)[0];

    var ch = str.charAt(str_i);

    var result = shuffled_str.concat(ch);
    shuffled_str = result;
  }

  return shuffled_str;
}
/*---------------------------------------------------------------------------------------------*/

function str_to_array(str) {

  var str_array = [];

  for (var i=0; i<str.length; i++) {
    var ch = str.charAt(i);
    str_array.push(ch);
  }
  
  return str_array;
}
/*---------------------------------------------------------------------------------------------*/

function array_to_str(a) {
  
  var str = "";

  for(var i=0; i<a.length; i++) {

    var result = str.concat(a[i]);
    str = result;
  }
  return str;
}

/*---------------------------------------------------------------------------------------------*/

function swap (a, i, j) {

  var temp = a[i];
  a[i] = a[j];
  a[j] = temp;

  return a;
}

/*---------------------------------------------------------------------------------------------*/

// Searches for 'ch' in 'a' starting from 'i' until the end of 'a'
// Returns -1 if not found or the index of first encounter.
function search_right (a, ch, i) {

  for (var j=i; j<a.length; j++)
    if (a[j] == ch)
      return j;

  return -1; 
}

/*---------------------------------------------------------------------------------------------*/

// Finds 'ch' to the right then moves it over towards 'i' position incrementally.
// Eg.
// bring_home([b, c, a], 'a', 0) does --->  [b, c, a] --> [b, a, c] -> [a, b, c]
// Returns array of string for each stage.
function bring_home_char (a, ch, i) {

  var strings = [];


  var j = search_right(a, ch, i);
  while (j > i) {

    swap(a, j, j-1);
    var str = array_to_str(a);
    
    strings.push(str);
    j--;
  }

  return strings;
}

/*---------------------------------------------------------------------------------------------*/

// Returns a array of strings for each stage going from 'shuffled_str' back to 'str'
function bring_home(str, shuffled_str) {

  var strings = [];
  var a = str_to_array(shuffled_str);

  //strings.push(array_to_str(a))

  for (var i=0; i<str.length; i++) {
    var ch = str.charAt(i);
    strings = strings.concat(bring_home_char(a, ch, i));

    if (array_to_str(a) == str)
      break;
  }

  return strings;
}

/*---------------------------------------------------------------------------------------------*/
function set_inner_html(param) {

  var original = param.obj.getAttribute('data-original');

  if (original == param.original)
    param.obj.innerHTML = param.str;
}

/*---------------------------------------------------------------------------------------------*/
function shuffle_inner_html(obj) {

  var str = obj.innerHTML;
  obj.innerHTML = shuffle(str); 
  obj.setAttribute('data-original', str);
}

/*---------------------------------------------------------------------------------------------*/

function bring_home_inner_html(obj, interval) {

  var timer = new RunTimer(interval);

  var str = obj.getAttribute('data-original');
  var shuffled_str = obj.innerHTML;

  var strings = bring_home(str, shuffled_str);

  for (var i=0; i<strings.length; i++)
    timer.add_event(set_inner_html, {obj: obj, str: strings[i], original: str});

  timer.run();
}

/*---------------------------------------------------------------------------------------------*/

function shuffle_all_shuffle_me(interval) {

  shuffle_us = document.getElementsByClassName("shuffle_me");

  for (var i=0; i<shuffle_us.length; i++)
    shuffle_inner_html(shuffle_us[i]);
  
  for (var i=0; i<shuffle_us.length; i++)
    bring_home_inner_html(shuffle_us[i], interval);
} 


/*---------------------------------------------------------------------------------------------*/
function shuffle_element(element, interval) {

    shuffle_inner_html(element);
	bring_home_inner_html(element, interval);
}
/*---------------------------------------------------------------------------------------------*/

return {
  shuffle: shuffle, 
  
  str_to_array: str_to_array,
  array_to_str: array_to_str,
  swap: swap,
  search_right: search_right,
  
  bring_home_char: bring_home_char,
  bring_home: bring_home,
  bring_home_inner_html: bring_home_inner_html,
  
  set_inner_html: set_inner_html,
  
  shuffle_inner_html: shuffle_inner_html,
  shuffle_all_shuffle_me: shuffle_all_shuffle_me,
  shuffle_element: shuffle_element

};

/*---------------------------------------------------------------------------------------------*/
})();
