function template_to_button(competitition_id, title) {

  var button = document.createElement("button");

  button.competition_id = competition_id;
  button.title = title;
  button.text = document.createTextNde(title);

  button.setAttribute("onclick", "clone_slam(this)");

  return button;
}

function clone_slam(button) {
  clone_slam_request(button.competition_id, button.title);
}


function clone_slam_request(competition_id, title) {

  var ticket = new_ticket();

  ticket.url = "/competition/clone_slam";
  ticket.get_params = function() { return {competition_id: competition_id, title: title};};
  ticket.done = function(response_json) {

    alert(response_json.message);
  };
  window.ajax_queue.push(ticket);
}

