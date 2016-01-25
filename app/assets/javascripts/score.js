
/*----------------------------------------------------------------------------------------------------------------------------------*/

var places = [0, "first", "second", "third", "fouth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth"];

var num_rounds = 2;
var grace_time = 10;

/*----------------------------------------------------------------------------------------------------------------------------------*/

notify_new = function(me) {

  var notify = {};

  notify.me = me;
  notify.call_backs = [];

  /*-------------------------------------------------------------------------------------------------------------------------------*/
  notify.notify = function () {

    for (var i=0; i<this.call_backs.length; i++) {

      var func = this.call_backs[i].func;
      var owner = this.call_backs[i].owner;

      func(owner, this.me);
    }
  }
  /*-------------------------------------------------------------------------------------------------------------------------------*/

  notify.add_notify = function(func, owner) {

    var data = {func: func, owner: owner};
    this.call_backs.push(data);
  }

  /*--------------------------------------------------------------------------------------------------------------------------------*/

  return notify;
}

/*----------------------------------------------------------------------------------------------------------------------------------*/

poet_new = function (name) {

  var poet = {};
  poet.name = name;
  poet.total_score = 0;
  poet.performances = [];
  poet.notify_score = notify_new(poet);
  poet.notify_name = notify_new(poet);

  /*-------------------------------------------------------------------------------------------------------------------------------*/

  poet.set_name = function(name) {

    this.name = name;

    for (var i=0; i<this.performances.length; i++)
      this.performances[i].name = name;

    this.notify_name.notify();
  }


  /*-------------------------------------------------------------------------------------------------------------------------------*/

  poet.add_performance = function(performance) {

    this.performances.push(performance);
    performance.add_notify_score(this.calculate, this)

  }
  /*-------------------------------------------------------------------------------------------------------------------------------*/
  poet.calculate = function(me) {

    if (typeof me === 'undefined')
      me = this;

    me.total_score = 0;
    for (var i=0; i< me.performances.length; i++) {
      me.total_score += me.performances[i].score;
      me.performances[i].subscore = me.total_score;
    }

    me.notify_score.notify();
  }
  /*-------------------------------------------------------------------------------------------------------------------------------*/

  return poet;
}

/*----------------------------------------------------------------------------------------------------------------------------------*/

performance_new = function (name, prev, time_limit, num_judges) {

  var performance = {};

  performance.id = makeid(20);
  performance.time_limit = time_limit;
  performance.num_judges = num_judges; // = 5;// to see if I refactored correctly
  /*--------------------------------------------------------------------------------------------------------------------------------*/
  // Notify that the score has been (re)calculated.

  performance.add_notify_score = function(func, owner) {

    var data = {func: func, owner: owner};
    this.call_backs_score.push(data);
  }

  /*--------------------------------------------------------------------------------------------------------------------------------*/
  // Notify that the rank has been (re)calculated.

  performance.add_notify_rank = function(func, owner) {

    var data = {func: func, owner: owner};
    this.call_backs_rank.push(data);
  }

  /*--------------------------------------------------------------------------------------------------------------------------------*/

  performance.notify_score = function() {

    for (var i=0; i<this.call_backs_score.length; i++) {

      var func = this.call_backs_score[i].func;
      var owner = this.call_backs_score[i].owner;

      func(owner, this);
    }
  }
  /*--------------------------------------------------------------------------------------------------------------------------------*/

  performance.notify_rank = function() {

    for (var i=0; i<this.call_backs_rank.length; i++) {

      var func = this.call_backs_rank[i].func;
      var owner = this.call_backs_rank[i].owner;

      func(owner, this);
    }
  }


  /*--------------------------------------------------------------------------------------------------------------------------------*/

  performance.set_rank= function(rank) {
    this.rank = rank;
    this.notify_rank();
  }


  /*--------------------------------------------------------------------------------------------------------------------------------*/

  performance.set_penalty = function(penalty) {

    this.penalty = penalty;
    this.calculate();
  }

  /*--------------------------------------------------------------------------------------------------------------------------------*/

  performance.set_time = function(min, sec) {

    this.seconds = min * 60 + sec;
    this.calculate();
  }


  /*--------------------------------------------------------------------------------------------------------------------------------*/
  performance.calculate_time_penalty = function() {

    var over_time;
    var penalty;

    if (this.seconds <= this.time_limit + grace_time)
      return 0;

    over_time = this.seconds - this.time_limit;
    over_time = Math.floor(over_time / 10);
    penalty = over_time * 0.5;

    return penalty;
  }

  /*--------------------------------------------------------------------------------------------------------------------------------*/
  performance.judge = function (judge_num, score) {

    this.judges[judge_num] = score;
    this.calculate();

  }
  /*--------------------------------------------------------------------------------------------------------------------------------*/
  performance.find_min_judge = function() {

    var min_score = Infinity;
    var min_judge;

    for (var i=0; i<this.num_judges; i++)
      if (min_score > this.judges[i]) {
	min_score = this.judges[i];
	this.min_judge = i;
      }
  }

  /*--------------------------------------------------------------------------------------------------------------------------------*/
  // Precondition: find_min_judge was called before calling this function. This is because if all the judges have the same score
  // The minimum and maximum judges cannot be the same judges.
  performance.find_max_judge = function() {

    var max_score = -Infinity;
    var max_judge;

    for (var i=0; i<this.num_judges; i++)
      if (max_score < this.judges[i] && i != this.min_judge) {
	max_score = this.judges[i];
	this.max_judge = i;
      }
  }
  /*--------------------------------------------------------------------------------------------------------------------------------*/

  performance.add_up_judges = function() {

    var sum = 0;

    if (slam.do_not_include_min_and_max_scores) {
      this.find_min_judge();
      this.find_max_judge();
    }

    for (var i=0; i<this.num_judges; i++) 
      if (i != this.min_judge && i != this.max_judge)
	sum += this.judges[i];

    return sum;
  }


  /*--------------------------------------------------------------------------------------------------------------------------------*/

  performance.calculate = function(me) {

    if (typeof me === 'undefined')
      me = this;

    me.score = 0;
    me.score += me.add_up_judges(); 
    me.score -= me.penalty;
    me.score -= me.calculate_time_penalty();

    me.notify_score();
  }

  /*--------------------------------------------------------------------------------------------------------------------------------*/

  performance.init = function(name, prev) {

    if (prev == null) 
      this.poet = poet_new(name);
    else {
      this.poet = prev.poet;
      
      this.prev.add_notify_score(this.calculate, this);
    }

    this.poet.add_performance(this);
  }



  /*--------------------------------------------------------------------------------------------------------------------------------*/


  performance.name = name;
  performance.prev = prev;

  performance.penalty = 0;
  performance.seconds = 0;

  performance.judges = [];
  for (var i=0; i< performance.num_judges; i++)
    performance.judges[i] = 0;

  performance.score = 0;
  performance.rank = Infinity; // 1 = first place, 2, second place, etc...


  performance.subscore = 0;

  performance.call_backs_score = [];
  performance.call_backs_rank = [];

  performance.init(name, prev);

  return performance;
}


/*----------------------------------------------------------------------------------------------------------------------------------*/
round_new = function (num_places, round_number) {

  var round = {};

  round.num_places = num_places;
  round.round_number = round_number;
  round.performances = [];

  round.call_backs = [];
  /*--------------------------------------------------------------------------------------------------------------------------------*/

  round.rank = function(me) {

    if (typeof me === 'undefined')
      me = this;

    var rankings = [];

    for (var i=0; i<me.performances.length; i++) {
      // Turn subscore into an "integer" because "floats" don't work well with comparisons 
      var subscore = Math.round(me.performances[i].subscore * 10);
      rankings.push(subscore);
    }

    rankings.sort(function(a, b){return b - a;});

    for (var i=0; i<me.performances.length; i++) {

      // Turn subscore into an "integer" because "floats" don't work well with comparisons 
      var subscore = Math.round(me.performances[i].subscore * 10);
      var ranking = rankings.indexOf(subscore) + 1;
      me.performances[i].set_rank(ranking);
    }
    me.notify_rank();
  }  

  /*-------------------------------------------------------------------------------------------------------------------------------*/

  round._get_winners = function() {

    var winners = [];
    var result = {};

    winners.push(null);
    for (var i=1; i<=this.num_places; i++)
      winners.push([]);

    for (var i=0; i<this.performances.length; i++) {

      var rank = this.performances[i].rank;
      if (rank <= this.num_places)
	winners[rank].push(this.performances[i]);
    }

    return winners;
  }
  /*-------------------------------------------------------------------------------------------------------------------------------*/

  // Returns a hash 
  //  
  //   So in the Winter Sesion of Vancouver Poetry Slam there are 5 winners unless there's a tie for 5th place.
  //   If that happens then there will be 6 winners.
  //
  //   result.winners: an array of winners
  //   result.result: 0 if successful, otherwise the number of the 'place' (1st place, 2nd place, etc) where there were too many ties.
  //   result.overflow: an array of 'place' containing too many ties.


  round.get_winners = function() {

    var result = {};
    var winners = this._get_winners();

    result.result = 0;
    result.winners = [];

    // Winners for all but the last 'place'
    for (var i=1; i<this.num_places && result.winners.length < this.num_places; i++)
      if (result.winners.length + winners[i].length <= this.num_places) {
	var _winners = result.winners.concat(winners[i]);
	result.winners = _winners;
      } else {
	// Too many ties....

	result.result = i;
	result.overflow = winners[i];
      }

    if (result.result == 0 && result.winners.length < this.num_places) {
      // In the event of a tie, this.num_places + 1 is acceptable....
      if (result.winners.length + winners[this.num_places].length <= this.num_places + 1) {

	var _winners = result.winners.concat(winners[this.num_places]);
	result.winners = _winners;
      }
      else {
	result.result = this.num_places;
	result.overflow = winners[this.num_places];
      }
    }

    return result;
  }
  /*-------------------------------------------------------------------------------------------------------------------------------*/

  round.add_performance = function(performance) {

    performance.add_notify_score(this.rank, this);
    this.performances.push(performance);

    performance.round = this;  // The performance knows which round it's in

  }

  /*--------------------------------------------------------------------------------------------------------------------------------*/
  round.call_backs = [];
  /*--------------------------------------------------------------------------------------------------------------------------------*/
  // Notify that the rank has been (re)calculated.

  round.add_notify_rank = function(func, owner) {

    var data = {func: func, owner: owner};
    this.call_backs.push(data);
  }

  /*--------------------------------------------------------------------------------------------------------------------------------*/

  round.notify_rank = function() {

    for (var i=0; i<this.call_backs.length; i++) {

      var func = this.call_backs[i].func;
      var owner = this.call_backs[i].owner;

      func(owner, this);
    }
  }
  /*--------------------------------------------------------------------------------------------------------------------------------*/

  return round;

}

/*----------------------------------------------------------------------------------------------------------------------------------*/
