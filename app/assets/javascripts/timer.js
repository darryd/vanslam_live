function RunTimer(interval) {

  this.interval = interval;
  this.events = [];


  this.run = function () {

    // Passing the third parameter to setInterval function is not supported in IE9 or earlier.
    this.this_id = setInterval(this.next, this.interval, this.events);

  }

  this.next = function(events) {

    if (events.length > 0) {

      var event = events[0];
      event.func(event.param);

      events.splice(0, 1);
    }
  };

  this.add_event = function(func, param) {

    var event = {};
    event.func = func;
    event.param = param;

    this.events.push(event);
  };
}
