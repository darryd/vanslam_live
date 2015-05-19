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


    if not_allowed()
      return
    end

    if missing_params(params, ['round_id', 'name', 'web_sock_id'])
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
    event_hash[:web_sock_id] = params[:web_sock_id]
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

    if missing_params(params, ['performance_id', 'judge_name', 'value', 'web_sock_id'])
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
    event_hash[:web_sock_id] = params[:web_sock_id]
    event_hash[:judge_name] = judge_name
    event_hash[:value] = judge.value

    competition = performance.round.competition
    new_event(competition, event_hash)

  end
  #-----------------------------------------------------------------------------------------#
  def set_time
    if not_allowed()
      return
    end
  end

  #-----------------------------------------------------------------------------------------#
  def set_penalty
    if not_allowed()
      return
    end
  end

  #-----------------------------------------------------------------------------------------#
  def get_current_event_number

    if missing_params(params, ['competition_id'])
      return
    end
    
    begin
      competition = Competition.find(params[:competition_id])
    rescue
      render json: {:result => false, :message => "Could not find competition."}
      return
    end

    render json: {:result => true, :event_number => competition.event_number}
  end
  #-----------------------------------------------------------------------------------------#
  def get_event

    if missing_params(params, ['competition_id', 'event_number'])
      return
    end

    begin
      competition = Competition.find(params[:competition_id])
    rescue
      render json: {:result => false, :message => "Could not find competition."}
      return
    end

    event = competition.events.where(event_number: params[:event_number]).take

    if event == nil
      render json: {:result => false, :message => "Could not find event."}
      return
    end

    event = JSON.parse(event.event)
    render json: event
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
      # add event_number and competition_id
      event_hash[:event_number] = event_number
      event_hash[:competition_id] = competition.id

      event = Event.new(competition_id: competition.id)
      event.event_number = event_number
      event.event = event_hash.to_json.to_s

      # Save scorekeeper_id
      event.scorekeeper_id = is_logged_in.scorekeeper_id
      event.save

    end

    ChatDemo::ChatBackend.hello(event_hash)

  end
  #-----------------------------------------------------------------------------------------#


end

