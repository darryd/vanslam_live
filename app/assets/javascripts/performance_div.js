

/*----------------------------------------------------------------------------------------------------------------------------------*/
function performance_div_new(performance) {

  var div = document.createElement("div");
  div.structure = {"Judges": slam.num_judges, "Time": 2, "Penalty": 1, "Score": 1, "Subscore": 1, "Total Score": 1, "Rank":1};
  div.order = ["Judges", "Time", "Penalty", "Score", "Subscore", "Total Score", "Rank"];

  div.performance = performance;
  div.id = makeid(20);
  div.className = "row";

  return div;
}

/*----------------------------------------------------------------------------------------------------------------------------------*/
function performance_div_build_headings(performance_div) {


  var div = document.createElement("div");




}



/*----------------------------------------------------------------------------------------------------------------------------------*/

