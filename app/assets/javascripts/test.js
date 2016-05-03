function test_how_long() {

  var a = {x:0};

  setInterval(function(a) {
    a.x++;
    if (a.x == 4000) {
      alert ("hello");
    }
  }, 1, a);
}
