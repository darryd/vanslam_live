
var CONFIRMATION_SENT = "red";
var CONFIRMATION_RECEIVED = "green";
var LIGHT_WIDTH = 5

var collection_of_lights = {
  lights: [],

  add_light: function (light) {

    var index = this.lights.length;    
    this.lights.push(light);

    return index;
  },

  confirmation_send: function (index) {

    if (index >= this.lights.length)
      return undefined;

    var confirmation = "" + index + ":" + makeid(10);
    var light = this.lights[index];
    light.set_confirmation(confirmation);
    light.set_color(CONFIRMATION_SENT);

    return confirmation;
  },


  confirmation_received: function(confirmation) {

    for (var i=0; i<this.lights.length; i++) 
      if (this.lights[i].confirmation == confirmation) {
	this.lights[i].set_color(CONFIRMATION_RECEIVED);
	break;
      }

  }
};

function new_light () {

  var light = {
    x: undefined,
    y: undefined,
    confirmation:undefined,
    color: undefined,

    set_confirmation: function(confirmation) {
      this.confirmation = confirmation;
    },

    set_location: function(x, y) {
      this.x = x;
      this.y = y;
    },
    set_color: function (color) {
      this.color = color;
      // do something to the canvas
    }
  };
  return light;
}

