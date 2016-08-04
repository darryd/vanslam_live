
CONFIRMATION_SENT = "red";
CONFIRMATION_RECEIVED = "green";
window.LIGHT_WIDTH = 5;


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
    light.draw();

    return confirmation;
  },


  confirmation_received: function(confirmation) {

    for (var i=0; i<this.lights.length; i++) 
      if (this.lights[i].confirmation == confirmation) {
	this.lights[i].set_color(CONFIRMATION_RECEIVED);
	this.lights[i].draw();

	var interval = 3000;
	setTimeout(reset_light, interval, this.lights[i]); 

	break;
      }

  },

  draw: function () {

    for (var i=0; i<this.lights.length; i++) {
      var light = this.lights[i];
      light.hover();
    }
  }

};

function draw_all_lights() {

  var interval = 33;

  if (login_info.is_logged_in)
    collection_of_lights.draw();

  setTimeout(draw_all_lights, interval);
} 

function reset_light(light) {
  light.set_color(undefined);
  light.draw();
}


function new_light (object) {

  var canvas = new_canvas();

  var light = {
    x: undefined,
    y: undefined,
    offset_x: 0,
    offset_y: 0,
    object: object,
    confirmation: undefined,
    color: undefined,
    canvas: canvas,

    set_confirmation: function(confirmation) {
      this.confirmation = confirmation;
    },

    set_offset: function(x, y) {
      this.offset_x = x;
      this.offset_y = y;
    },
    set_color: function (color) {
      this.color = color;
    },

    draw: function() {

      var ctx = this.canvas.getContext("2d");

      if (this.color == undefined) {
	ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	return;
      }

      ctx.fillStyle = this.color;
      ctx.fillRect(0, 0, LIGHT_WIDTH, LIGHT_WIDTH);
    },

    hover: function() {
      try {


	if (this.object == undefined)
	  return;

	var position = $(this.object).offset();

	this.x = position.left + this.offset_x; // + left;
	this.y = position.top + this.offset_y //+ top;

	this.canvas.style.left = Math.floor(this.x) + "px";
	this.canvas.style.top  = Math.floor(this.y) + "px";

      }
      catch (e) {

	console.log ("error with hover");
	console.log(e);
      }

    }
  };
  return light;
}

//http://stackoverflow.com/a/1480137
function cumulativeOffset (element) {
  var top = 0, left = 0;
  do {
    top += element.offsetTop  || 0;
    left += element.offsetLeft || 0;
    element = element.offsetParent;
  } while(element);

  return {
    top: top,
      left: left
  };
}

function hover(light) {
}

/*
function make_canvas() {
  var canvas = document.createElement("canvas");
  canvas.id = "lights_canvas";
  canvas.style.position = "absolute";
  canvas.style.left = "0px";
  canvas.style.top = "0px";
  canvas.style.zIndex = "5";
  canvas.style.pointerEvents = "none";

  document.body.appendChild(canvas);
  resize_canvas_if_logged_in();
}
*/

function new_canvas() {
  var canvas = document.createElement("canvas");

  canvas.style.position = "absolute";
  canvas.style.left = "0px";
  canvas.style.top = "0px";
  canvas.style.zIndex = "5";
  canvas.style.pointerEvents = "none";

  document.body.appendChild(canvas);

  return canvas;
}
/*
   window.addEventListener("resize", function() {

   var canvas = document.getElementById("lights_canvas");
   canvas.width = $(document).width();
   canvas.height = $(document).height();

   });
   */
