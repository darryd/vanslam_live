/*----------------------------------------------------------------------------------------------------------------------------------*/
 function score_entered(judge_ui) {
   //judge_ui.input.value = "" + parseFloat(judge_ui.input.value)/10);


   var value = parseInt(judge_ui.input.value) / 10;

   judge_ui.input.value = value;


   judge_ui.performance.judge(judge_ui.judge_i, parseFloat(judge_ui.input.value));
   judge_ui.comm.score_entered(judge_ui.comm, judge_ui.judge_i, parseFloat(judge_ui.input.value));
 }

/*----------------------------------------------------------------------------------------------------------------------------------*/

judge_ui_new = function (performance, judge_i, comm) {

 var judge_ui = {};

 judge_ui.performance = performance;
 judge_ui.judge_i = judge_i;
 judge_ui.comm = comm;
 
 judge_ui.input = create_input(judge_ui, "score_entered(this.ui)");

 var table = build_input_table("" + (judge_i + 1), judge_ui.input);
// table.judge_ui = judge_ui;

 // Info
 var tr = document.createElement("tr");
 var td = document.createElement("td");
 judge_ui.info = document.createElement("p");
 td.appendChild(judge_ui.info);
 tr.appendChild(td);
 table.appendChild(tr);

 /*--------------------------------------------------------------------------------------------------------------------------------*/
 judge_ui.score_updated_f = function(me, performance) {


   var message = ""; // + performance.judges[me.judge_i];
   var color = "Black";


   if (me.judge_i == performance.min_judge) {
     message = "LOW";
     color = "Red";
   }
   else if (me.judge_i == performance.max_judge) {
     message = "HIGH";
     color = "Red";
   }
   else {
     message = ".";
     color = "Black";

   }
   
   me.info.innerHTML = message;
   me.input.style.color = color;
   me.info.style.color = color;
 }

 /*--------------------------------------------------------------------------------------------------------------------------------*/

 performance.add_notify_score(judge_ui.score_updated_f, judge_ui);
 performance.calculate();

 return table;
}

/*----------------------------------------------------------------------------------------------------------------------------------*/
