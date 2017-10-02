var NUM_COLUMNS = 12;

/*----------------------------------------------------------------------------------------------------------------------------------*/
function p_div_new(performance) {

	var div = document.createElement("div");
	div.className = "performance_div";
	div.id = makeid(20);
	div.style.zIndex = "1";
	var name = performance.name;

	div.comm = comm_new(div, performance.name); //Create comm object for communictiation with the server. 
	performance.comm = div.comm;

	performance.add_notify_rank(p_div_rank_updated, div);
	performance.add_notify_score(p_div_score_updated, div);

	var row = document.createElement("div");
	row.className = 'row';
	var column = document.createElement('div');
	column.className = 'small-11 columns';
	
	column.innerHTML = "<h3> <span style='color:#F2ECD2'>" + name + "</span> </h3>"; 
	div.name = column;

	var change_name = function(p_div, poet) {
		p_div.name.innerHTML = "<h3> <span style='color:#F2ECD2'>" + poet.name + "</span> </h3>"; 
	};
		
	performance.poet.notify_name.add_notify(change_name, div);

	row.appendChild(column);

	var light = new_light(column);
	div.light_index = collection_of_lights.add_light(light);


	var column = document.createElement("div");
	column.className = 'small-2 columns';

	var remove_me = make_remove_me_div(div.id);
	column.appendChild(remove_me);
	row.appendChild(column);

	div.appendChild(row);



	div.column_length = {Judges: slam.num_judges, Time: 2, Penalty: 1};
	div.titles = ["Judges", "Time", "Penalty"];
	p_div_build_columns_hash(div);

	div.performance = performance;

	p_div_build_titles_row(div);
	p_div_build_sub_titles(div);
	p_div_build_data_row(div);
	p_div_build_footers(div);

	div.style.backgroundColor = 'black';
	div.style.borderStyle = 'solid';
	div.style.borderWidth = '1px';

	row = document.createElement("div");
	row.className = "row";

	/*
	   column = document.createElement("div");
	   column.className = "small-12 columns";
	   column.style.minHeight = "15px"; //http://stackoverflow.com/a/25431669

	   row.appendChild(column);
	   div.appendChild(row);
	   */

	row = document.createElement("div");
	row.className = "row";

	column = document.createElement("div");
	column.className = "small-2 medium-1 columns";
	column.style.color = "#5E5C42";
	column.innerHTML = "<p> Score: </p>";
	row.appendChild(column);

	div.score_column = document.createElement("div");
	div.score_column.className = "small-2 medium-1 columns";
	div.score_column.innerHTML = "";
	row.appendChild(div.score_column);


	if (div.performance.prev != null) {

		column = document.createElement("div");
		column.className = "small-2 medium-1 columns";
		column.style.color = "#5E5C42";
		column.innerHTML = "<p> Total: </p>";
		row.appendChild(column);

		div.cumulative_column = document.createElement("div");
		div.cumulative_column.className = "small-2 medium-1 columns";
		div.cumulative_column.innerHTML = "";
		row.appendChild(div.cumulative_column);

	}

	column = document.createElement("div");
	column.className = "small-2 medium-1 columns";
	column.style.color = "#5E5C42";
	column.innerHTML = "<p> Rank: </p>";
	row.appendChild(column);

	div.rank_column = document.createElement("div");
	div.rank_column.className = "small-2 medium-1 columns end";
	div.rank_column.innerHTML = "";
	row.appendChild(div.rank_column);

	div.appendChild(row);

	// Tied with
	row = document.createElement("div");
	row.className = "row";
	div.tied_with = document.createElement("div");
	div.tied_with.className = "small-12 columns";
	row.appendChild(div.tied_with);
	div.appendChild(row);


	// Going into the next round
	row = document.createElement("div");
	row.className = "row";
	div.is_going_on = document.createElement("div");
	div.is_going_on.className = "small-12 columns";
	row.appendChild(div.is_going_on);
	div.appendChild(row);

	return div;
}

/*----------------------------------------------------------------------------------------------------------------------------------*/
function p_div_build_columns_hash(div) {

	var num_columns = 12;

	var columns = div.columns = {};
	var titles = div.titles;

	var remaining_columns = num_columns;
	for (var i=0; i<titles.length; i++) {
		columns[titles[i]] = remaining_columns;
		remaining_columns -= div.column_length[titles[i]];

		if (i > 0) {
			for (j=0; j<i; j++) {
				columns[titles[j]] = div.column_length[titles[j]];
			}
		}
	}
}
/*----------------------------------------------------------------------------------------------------------------------------------*/
function p_div_build_titles_row(div) {

	var row = document.createElement("div");
	row.className = "row";

	for (var i=0; i<div.titles.length; i++) {

		var column = document.createElement("div");
		column.className = "small-" + div.columns[div.titles[i]] + " columns";

		column.innerHTML = "<span style='color:#A18A59;'>" + div.titles[i] + "</span>";

		row.appendChild(column);

	}
	div.appendChild(row);
}
/*----------------------------------------------------------------------------------------------------------------------------------*/
function p_div_build_sub_titles(div) {

	var num_columns = 12;

	var row = document.createElement("div");
	row.className = "row";

	// Add Judges
	var column;
	for (var i=0; i<slam.num_judges; i++) {

		column = document.createElement("div");

		column.className = "small-1 columns";
		column.innerHTML = "<span style='color:#5E5C42'>" + (i + 1) + "</span>";

		row.appendChild(column);
	}
	// Add Time
	column = document.createElement("div");
	column.className = "small-1 columns";
	column.innerHTML = "<span style='color:#5E5C42'>m</span>";
	row.appendChild(column);

	column = document.createElement("div");
	column.className = "small-1 columns end";
	column.innerHTML = "<span style='color:#5E5C42'>s</span>";
	row.appendChild(column);

	div.appendChild(row);
}

/*----------------------------------------------------------------------------------------------------------------------------------*/
function p_div_setup_indexes(div) {

	div.data_columns = [];
	div.indexes = {};

	var i = slam.num_judges;

	div.indexes.minutes_i = i++;
	div.indexes.seconds_i = i++;
	div.indexes.penalty_i = i++;
	div.indexes.score_i = i++;
	div.indexes.subscore_i = i++;
	div.indexes.rank = i;
}
/*----------------------------------------------------------------------------------------------------------------------------------*/
function format_value(value) {

	// Return a value that has at most one decimal place.
	return Math.round(value * 100) / 100;
}
/*----------------------------------------------------------------------------------------------------------------------------------*/
function p_div_update_data_column(div, index, value) {
	div.data_columns[index].innerHTML = format_value(value);

	// Why bother displaying subscore when it equals score?
	if (div.performance.prev == null)
		div.data_columns[div.indexes.subscore_i].innerHTML = '';
}

/*----------------------------------------------------------------------------------------------------------------------------------*/
function p_div_score_updated(div, performance) {


	//p_div_update_data_column(div, div.indexes.score_i, performance.score);
	//p_div_update_data_column(div, div.indexes.subscore_i, performance.subscore);


	div.score_column.innerHTML = format_value(performance.score);

	if (div.performance.prev != null) 
		div.cumulative_column.innerHTML = format_value(performance.subscore);




	var min_i = performance.min_judge;
	var max_i = performance.max_judge;

	if (slam.do_not_include_min_and_max_scores) {
		for (var i=0; i<slam.num_judges; i++) {
			div.footers[i].innerHTML = "<p></p>";
			div.data_columns[i].style.color = "#F2ECD2";
		}

		var min_max_color = "#A18A59";

		var low_str = "<p class='visible-for-small-only'>L</p><p class='visible-for-medium-up'>LOW</p>";
		var high_str = "<p class='visible-for-small-only'>H</p><p class='visible-for-medium-up'>HIGH</p>";

		div.data_columns[min_i].style.color = min_max_color;
		div.data_columns[max_i].style.color = min_max_color;

		div.footers[min_i].innerHTML = low_str;
		div.footers[min_i].style.color = min_max_color;

		div.footers[max_i].innerHTML = high_str;
		div.footers[max_i].style.color = min_max_color;
	}
	// Time Penalty

	var time_penalty = performance.calculate_time_penalty() * -1;
	if (time_penalty != 0){
		div.footers[slam.num_judges].innerHTML = "P:";
		div.footers[slam.num_judges].style.color = "#5E5C42";
		div.footers[slam.num_judges + 1].innerHTML = time_penalty;
		div.footers[slam.num_judges + 1].style.color = "#5E5C42";
	} 
	else {
		div.footers[slam.num_judges].innerHTML = "<p></p>";
		div.footers[slam.num_judges + 1].innerHTML = "<p></p>";
	}
}
/*----------------------------------------------------------------------------------------------------------------------------------*/
function p_div_rank_updated (div, performance) {

	div.rank_column.innerHTML = performance.rank;

	div.tied_with.innerHTML = performance.is_tied ? "<p> <span style='color:#5E5C42'> Tied With: </span> " + performance.names_tied_with.join() + "</p>" : "";

	div.is_going_on.innerHTML = performance.rank <= performance.round.num_places ? "<span style='color:#5E5C42'>Moving on!</span>" : "";
}
/*----------------------------------------------------------------------------------------------------------------------------------*/
function p_div_get_time(div) {

	var minutes = parse_int_or_return_zero(div.data_columns[div.indexes.minutes_i].value);
	var seconds = parse_int_or_return_zero(div.data_columns[div.indexes.seconds_i].value);

	return {minutes: minutes, seconds: seconds};
}

/*----------------------------------------------------------------------------------------------------------------------------------*/
function is_score_entered_fully(score) {


	if (score == "10")
		return true;

	if (score.length == 3) // eg. 9.6 (two digits and one decimal point)
		return true;

	return false;
}

/*----------------------------------------------------------------------------------------------------------------------------------*/
function p_div_judge_input_onkeyup(inputs, input) {

	//input.value = input.value.replace('\.', '');
	var index = parseInt(input.getAttribute('data-index'));

	if (is_score_entered_fully(input.value)) {


		if (index < slam.num_judges - 1)  {
			input.please_advance_automatically = false;
			next_input = inputs[index + 1];
			next_input.focus();
		}
		else {
			$(input).trigger("change");
			input.blur();
		}
	}
}
/*----------------------------------------------------------------------------------------------------------------------------------*/
// Assumes String is a valid number
function is_str_integer(str) {

	return parseInt(str) == parseFloat(str);
}
/*----------------------------------------------------------------------------------------------------------------------------------*/

function p_div_input_onkeyup(inputs, input) {


	if (!login_info.is_logged_in)
		return;


	var i = parseInt(input.getAttribute('data-index'));
	var div = input.div;
	var performance = div.performance;

	var value = parse_float_or_return_zero(input.value);


	switch (i) 
	{
		case div.indexes.minutes_i:
		case div.indexes.seconds_i:
			var time = p_div_get_time(div);
			//performance.set_time(time.minutes, time.seconds);
			heads_up_set_time(performance.performance_id, time.minutes, time.seconds);
			break;
		case div.indexes.penalty_i:
			//performance.set_penalty(value);
			heads_up_set_penalty(performance.performance_id, value);
			break;
		default:
			if (i >= 0 && i < div.indexes.minutes_i) {

				if (value > 10) {
					value /= 10;
					input.value = value;
					if (is_str_integer(input.value))
						input.value = value + ".0";
				}

				heads_up_judge(performance.comm.performance_id, i, value);
				if (input.please_advance_automatically) {
					p_div_judge_input_onkeyup(inputs, input);
					//$(input).trigger("change"); // For mobile
				}
				else if (is_score_entered_fully(input.value)){
					$(input).trigger("change");
					input.blur();
				}
				//performance.judge(i, value);
			}
	}

}


/*----------------------------------------------------------------------------------------------------------------------------------*/
function p_div_input_onblur(input) {



	var performance_id = input.div.performance.comm.performance_id;
	var index = parseInt(input.getAttribute('data-index'));

	heads_up_blur(performance_id, index);

}
/*----------------------------------------------------------------------------------------------------------------------------------*/
function p_div_input_onfocus(input) {

	var performance_id = input.div.performance.comm.performance_id;
	var index = parseInt(input.getAttribute('data-index'));

	heads_up_focus(performance_id, index);

}

/*----------------------------------------------------------------------------------------------------------------------------------*/
function p_div_input_entered(input) {


	if (!login_info.is_logged_in)
		return;

	if (input.old_value == input.value)
		return;
	input.old_value = input.value;

	var i = parseInt(input.getAttribute('data-index'));
	var div = input.div;
	var performance = div.performance;

	var value = parse_float_or_return_zero(input.value);

	var light_index = input.light_index;

	var confirmation = collection_of_lights.confirmation_send(light_index);

	switch (i) 
	{
		case div.indexes.minutes_i:
		case div.indexes.seconds_i:
			var time = p_div_get_time(div);
			performance.set_time(time.minutes, time.seconds);
			set_time_request(performance.comm, time.minutes, time.seconds, confirmation);
			break;
		case div.indexes.penalty_i:
			performance.set_penalty(value);
			set_penalty_request(performance.comm, value, confirmation);
			break;
		default:
			if (i >= 0 && i < div.indexes.minutes_i) {
				performance.judge(i, value);
				judge_request(performance.comm, i, value, confirmation);
			}
	}

}

/*----------------------------------------------------------------------------------------------------------------------------------*/
function p_div_set_score(p_div, judge_i, value, is_this_a_heads_up) {

	p_div.data_columns[judge_i].value = value;
	p_div.data_columns[judge_i].please_advance_automatically = false;
	p_div.performance.judge(judge_i, value);

	if (is_this_a_heads_up)
		p_div.data_columns[judge_i].style.fontStyle = "italic";
	else
		p_div.data_columns[judge_i].style.fontStyle = "normal";
}

/*----------------------------------------------------------------------------------------------------------------------------------*/
function p_div_set_time(p_div, minutes, seconds, is_this_a_heads_up) {

	var i = p_div.indexes.minutes_i;

	p_div.data_columns[i].value = minutes;
	p_div.data_columns[i].style.fontStyle = is_this_a_heads_up ? "italic" : "normal";

	p_div.data_columns[++i].value = seconds;
	p_div.data_columns[i].style.fontStyle = is_this_a_heads_up ? "italic" : "normal";

	p_div.performance.set_time(minutes, seconds);
}

/*----------------------------------------------------------------------------------------------------------------------------------*/
function p_div_set_penalty(p_div, value, is_this_a_heads_up) {

	var i = p_div.indexes.penalty_i;

	p_div.data_columns[i].value = value;
	p_div.data_columns[i].style.fontStyle = is_this_a_heads_up ? "italic" : "normal";

	p_div.performance.set_penalty(value);
}
/*----------------------------------------------------------------------------------------------------------------------------------*/
function p_div_build_data_row(div) {

	p_div_setup_indexes(div);

	var row = document.createElement("div");
	row.className = "row";

	var num_columns = slam.num_judges + 3; // Judges + Minutes + Seconds + Penalty

	var i;

	div.judge_inputs = [];


	for (i=0; i<num_columns; i++) {
		var column = document.createElement("div");
		column.className = "small-1 columns";

		var input = document.createElement("input");

		var light = new_light(input);
		input.light_index = collection_of_lights.add_light(light);

		input.inputs = div.judge_inputs;
		input.className = "scorekeeper_input"; 
		input.style.padding = "0px";
		input.style.backgroundColor = "#0D0908";
		input.style.borderColor = "#9CB99D";
		input.style.color = "#F2ECD2";

		if (i <= slam.num_judges)
			div.judge_inputs.push(input);

		input.div = div;
		input.className =  "scorekeeper_input";
		input.setAttribute('size', 4);
		input.setAttribute('onchange', 'p_div_input_entered(this)');
		input.setAttribute('onkeyup', 'p_div_input_onkeyup(this.inputs, this)');
		input.setAttribute('onfocus', 'p_div_input_onfocus(this)');
		input.setAttribute('onblur', 'p_div_input_onblur(this)');
		// http://stackoverflow.com/a/14236929
		$(input).on("keydown", function (e) {
			return e.which !== 32;
		});

		if (i < slam.num_judges) {
			// Only do this for inputs that are judges
			input.my_input_type = 'judge';
			input.please_advance_automatically = true;
			input.step = "0.1";
		}

		input.setAttribute('data-index', i);
		input.type = "number";
		input.style.width = "60px";
		input.setAttribute('data-max-width', '60');

		if (!login_info.is_logged_in)
			input.setAttribute('readonly', null);

		column.appendChild(input);


		div.data_columns.push(input);

		row.appendChild(column);
	}

	num_columns = 12;
	for (; i< num_columns; i++) {

		var column = document.createElement("div");
		column.className = "small-1 columns";
		row.appendChild(column);

		div.data_columns.push(column);
	}
	div.appendChild(row);
}
/*----------------------------------------------------------------------------------------------------------------------------------*/
function p_div_build_footers(div) {

	div.footers = [];

	var num_columns = 12;
	var row = document.createElement("div");
	row.className = "row";

	for (var i=0; i<num_columns; i++) {

		var column = document.createElement("div");
		column.className = "small-1 columns";
		column.innerHTML = "<p></p>"; 

		row.appendChild(column);
		div.footers.push(column);
	}

	div.appendChild(row);
}
/*----------------------------------------------------------------------------------------------------------------------------------*/
function get_distance_available_between_inputs() {

	var performance_divs = document.getElementsByClassName('performance_div');
	var width = 0;

	if (performance_divs.length > 0) {

		var p_div = performance_divs[0];
		var x1 = $(p_div.data_columns[0]).offset().left;
		var x2 = $(p_div.data_columns[1]).offset().left;

		var distance = x2 - x1;
		var max_width = parseInt(p_div.data_columns[0].getAttribute('data-max-width'));
		width = Math.min(distance, max_width);

	}

	return width;
}
/*----------------------------------------------------------------------------------------------------------------------------------*/
function resize_inputs(inputs) {

	// Set Width for all inputs
	//
	var width = get_distance_available_between_inputs();


	for (var i=0; i<inputs.length; i++) {
		inputs[i].style.width = width + "px";
	}
}
/*----------------------------------------------------------------------------------------------------------------------------------*/
function resize_all_inputs() {

	var inputs = document.getElementsByClassName('scorekeeper_input');

	resize_inputs(inputs);
}
/*----------------------------------------------------------------------------------------------------------------------------------*/


window.addEventListener("resize", resize_all_inputs, 100);
/*----------------------------------------------------------------------------------------------------------------------------------*/
