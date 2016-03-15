require File.expand_path('../../../app/middleware/chat_backend', __FILE__)

class CompetitionController < ApplicationController

  #-----------------------------------------------------------------------------------------#
  # Displays the competition

  def show
    begin
      @settings = Setting.take
      @slam = Competition.find(params[:id])
      @events = _get_event_range(@slam.id, 1, @slam.event_number)
    rescue
      redirect_to '/'
    end
  end

  #-----------------------------------------------------------------------------------------#
  def echo
    render json: {:sentence => params[:sentence], :reverse => params[:sentence].reverse};
  end

  #-----------------------------------------------------------------------------------------#
  
  # Params: 
  def new_round

    if not_allowed()
      return
    end

    # 'round_number'?
    if missing_params(params, ['competition_id', 'web_sock_id', 'round_number', 'time_limit'])
      return
    end

    r = Round.new

    r.competition_id = params[:competition_id]
    r.round_number = params[:round_number]
    r.title = "Extra Round"
    r.are_poets_from_previous = false
    r.time_limit = params[:time_limit]
    r.is_extra = true
    r.is_on_the_fly = true

    if r.save
      render json: {:result => true, :round_id => r.id}
    end

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

    # Optional Parameter is passed if the performance is in a cumulative round
    if params.has_key?('previous_performance_id')
     # Let's check that there is a Performance with such an id, if there isn't, this isn't a valid request. 
     begin
       previous = Performance.find(params[:previous_performance_id])
       performance.previous_performance_id = previous.id
     rescue
       render json: {:result => false, :message => "Could not find previous_performance"}
       return
     end
    end

    if performance.save

      render json: {:result  => true, :performance_id => performance.id}    

      # Send event to web socket

      event_hash = {};
      event_hash[:event] = "new_performance"
      event_hash[:performance_id] = performance.id
      event_hash[:previous_performance_id] = performance.previous_performance_id
      event_hash[:web_sock_id] = params[:web_sock_id]
      event_hash[:poet_name] = poet.name
      event_hash[:round_number] = round.round_number


      competition = performance.round.competition
      new_event(competition, event_hash)
    else
      # Error
      render json: {result => false, :message => "Error saving to database"}
      # TODO Some kind of log.

    end

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


    if judge.save

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

    else

      render json: {result => false, :message => "Error saving to database"}
      # TODO Some kind of log.

    end
  end
  #-----------------------------------------------------------------------------------------#
  def set_time
    if not_allowed()
      return
    end

    if missing_params(params, ['performance_id', 'minutes', 'seconds', 'web_sock_id'])
      return
    end


    begin
      performance = Performance.find(params[:performance_id])
    rescue
      render json: {:result => false, :message => "Could not find performance"}
      return
    end

    performance.minutes = params[:minutes].to_i
    performance.seconds = params[:seconds].to_i

    if performance.save
      render json: {:result => true, :performance => performance}


      # Send event to web socket

      event_hash = {}
      event_hash[:event] = "set_time"
      event_hash[:performance_id] = performance.id
      event_hash[:web_sock_id] = params[:web_sock_id]
      event_hash[:minutes] = performance.minutes
      event_hash[:seconds] = performance.seconds

      competition = performance.round.competition
      new_event(competition, event_hash)
    else

      render json: {result => false, :message => "Error saving to database"}
      # TODO Some kind of log.
    end
  end

  #-----------------------------------------------------------------------------------------#
  def set_penalty
    if not_allowed()
      return
    end

    if missing_params(params, ['performance_id', 'penalty', 'web_sock_id'])
      return
    end

    begin
      performance = Performance.find(params[:performance_id])
    rescue
      render json: {:result => false, :message => "Could not find performance"}
      return
    end

    performance.penalty = params[:penalty].to_f

    if performance.save
      render json: {:result => true, :performance => performance}


      # Send event to web socket

      event_hash = {}
      event_hash[:event] = "set_penalty"
      event_hash[:performance_id] = performance.id
      event_hash[:web_sock_id] = params[:web_sock_id]
      event_hash[:penalty] = performance.penalty

      competition = performance.round.competition
      new_event(competition, event_hash)
    else

      render json: {result => false, :message => "Error saving to database"}
      # TODO Some kind of log.
    end
  end

  #-----------------------------------------------------------------------------------------#

  def signup_poet

    if not_allowed()
      return
    end

    if missing_params(params, ['competition_id', 'name', 'web_sock_id'])
      return
    end

    begin
      competition = Competition.find(params[:competition_id])
    rescue
      render json: {:result => false, :message => "Could not find competition."}
      return
    end
    
    poet = Poet.where(name: params[:name]).take
    if poet == nil
      render json: {:result => false, :message => "Could not find poet."}
      return
    end

    render json: {:result => true}
    
    # Send event
    event_hash = {};
    event_hash[:event] = "signup_poet"
    event_hash[:web_sock_id] = params[:web_sock_id]
    event_hash[:name] = params[:name]

    new_event(competition, event_hash)

  end
  #-----------------------------------------------------------------------------------------#

  def remove_performance

    if not_allowed()
      return
    end

    if missing_params(params, ['performance_id', 'web_sock_id'])
      return
    end


    begin
      performance = Performance.find(params[:performance_id])
    rescue
      render json: {:result => false, :message => "Could not find performance"}
      return
    end

    competition = performance.round.competition
    performance.delete

    render json: {:result => true}

    # Send event
    event_hash = {}
    event_hash[:event] = "remove_performance"
    event_hash[:web_sock_id] = params[:web_sock_id]
    event_hash[:performance_id] = params[:performance_id]

    new_event(competition, event_hash)

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
    event[:result] = true
    render json: event
  end
  #-----------------------------------------------------------------------------------------#
  # Returns an array of events from [event_i, event_j], inclusive.
  def get_event_range

    if missing_params(params, ['competition_id', 'event_number_i', 'event_number_j'])
      return
    end

    begin
      competition = Competition.find(params[:competition_id])
    rescue
      render json: {:result => false, :message => "Could not find competition."}
      return
    end

    events = competition.events.where("event_number >= ? and event_number <= ?", params[:event_number_i].to_i, params[:event_number_j].to_i).order(:event_number)

    result_events = [] # Array to send back to the client

    events.each do |e|
      result_e = JSON.parse(e.event)
      result_events << result_e
    end

    render json: {:result => true, :events => result_events}
  end
  #-----------------------------------------------------------------------------------------#

  def what_did_i_miss
    if missing_params(params, ['competition_id', 'event_number'])
      return
    end

    begin
      competition = Competition.find(params[:competition_id])
    rescue
      render json: {:result => false, :message => "Could not find competition."}
      return
    end

    event_number_i = params[:event_number].to_i + 1
    event_number_j = competition.event_number

    events = _get_event_range(params[:competition_id], event_number_i, event_number_j)
    render json: {:events => events}
  end 

  #-----------------------------------------------------------------------------------------#
  def _get_event_range (competition_id, event_number_i, event_number_j)

    begin
      competition = Competition.find(competition_id)
    rescue
      return []
    end

    events = competition.events.where("event_number >= ? and event_number <= ?", event_number_i, event_number_j).order(:event_number)

    result_events = [] # Array to send back to the client

    events.each do |e|
      result_e = JSON.parse(e.event)

      if result_e[:datetime] == nil
	result_e['datetime'] = e.updated_at
      end

      result_events << result_e
    end

    result_events
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
      if not competition.save
	#TODO log failure
	return
      end

      # Update Event
      # add event_number and competition_id
      event_hash[:event_number] = event_number
      event_hash[:competition_id] = competition.id
      event_hash[:datetime] = Time.zone.now.to_json.sub('"', '')

      event = Event.new(competition_id: competition.id)
      event.event_number = event_number
      #event.datetime = Time.zone.now.to_json
      event.event = event_hash.to_json.to_s

      # Save scorekeeper_id
      event.scorekeeper_id = is_logged_in.scorekeeper_id
      if not event.save
	# TODO log failure
	return 
      end

    end

    ChatDemo::ChatBackend.hello(event_hash)

  end
  #-----------------------------------------------------------------------------------------#


end

