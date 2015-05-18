require File.expand_path('../../../app/middleware/chat_backend', __FILE__)

class CompetitionController < ApplicationController

  #-----------------------------------------------------------------------------------------#
  # Displays the competition

  def show
    begin
      @slam = Competition.find(params[:id])
    rescue
      redirect_to '/'
    end
  end

  #-----------------------------------------------------------------------------------------#
  def echo
    render json: {:sentence => params[:sentence], :reverse => params[:sentence].reverse};
  end

  #-----------------------------------------------------------------------------------------#
  # Creates a new performance
  #
  # Params: round_id, name
 
  def new_performance

    if not is_logged_in()
      render json: {:result => false, :message => "You must be logged in to do that."}
      return
    end

    begin
      round = Round.find(params[:round_id])
    rescue
      render json: {:result => false, :message => "No round found"}
      return
    end

    poet = Poet.where(name: params[:name]).first  

    if poet == nil
      render json: {:result => false, :message => "No poet found"}
      return
    end

    performance = Performance.new(round_id: round.id, poet_id: poet.id)
    performance.save

    render json: {:result  => true, :performance_id => performance.id}    
    
    # Send event to web socket

    event_hash = {};
    event_hash[:event] = "new_performance"
    event_hash[:performance_id] = performance.id
    event_hash[:poet_name] = poet.name
    event_hash[:round_number] = round.round_number


    competition = performance.round.competition
    new_event(competition, event_hash)

  end
  #-----------------------------------------------------------------------------------------#

  # performance_id, judge_name

  def judge

    if not_allowed()
      return
    end

    if missing_params(params, ['performance_id', 'judge_name', 'value'])
      return
    end

    begin
      performance = Performance.find(params[:performance_id])
    rescue
      render json: {:result => false, :message => "Could not find performance."}
      return
    end

    judge_name = params[:judge_name]
    judge = performance.judges.where(judge_name: judge_name).first_or_create(:judge_name=>judge_name) 

    judge.value = params[:value].to_f
    judge.save

    render json: {:result => true, :judge => judge}

    # Send event to web socket

    event_hash = {}
    event_hash[:event] = "judge"
    event_hash[:performance_id] = performance.id
    event_hash[:judge_name] = judge_name
    event_hash[:value] = judge.value

    competition = performance.round.competition
    new_event(competition, event_hash)

  end
  #-----------------------------------------------------------------------------------------#
  def new_event(competition, event_hash)

    competition.with_lock do

      # Update Competition
      if competition.event_number == nil
	competition.event_number = 0
      end

      event_number = competition.event_number + 1

      competition.event_number = event_number
      competition.save

      # Update Event
      event = Event.new(competition_id: competition.id)
      event.event_number = event_number
      event.event = event_hash.to_json.to_s

      # Save scorekeeper_id
      event.scorekeeper_id = is_logged_in.scorekeeper_id
      event.save

      event_hash[:event_number] = event_number
      event_hash[:competition_id] = competition.id
    end

    ChatDemo::ChatBackend.hello(event_hash)

  end
  #-----------------------------------------------------------------------------------------#


end

