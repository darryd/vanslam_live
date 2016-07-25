require File.expand_path('../../../app/middleware/chat_backend', __FILE__)

class CompetitionController < ApplicationController

  #-----------------------------------------------------------------------------------------#
  # Displays the competition

  def show
    begin

      host = Host.where(host: request.host).take


      @settings = Setting.take
      @slam = host.organization.competitions.find(params[:id])
      @events = _get_event_range(@slam.id, 1, @slam.event_number)

      if params.has_key?(:json)
	render json: {:settings => @settings, :slam => @slam, :events => @events, :rounds => @slam.rounds}
	return
      end

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

      if missing_params(params, ['competition_id', 'web_sock_id', 'time_limit', 'grace_period'])
	return
      end


      host = Host.where(host: request.host).take

      begin
	competition = host.organization.competitions.find(params[:competition_id])
      rescue
	render json: {:result => false, :message => "Could not find competition."}
	return
      end

      # 'round_number'?
      Round.transaction do
	round_number = 1 + competition.rounds.maximum(:round_number)

	r = Round.new
	r.competition_id = params[:competition_id]
	r.round_number = round_number = round_number
	r.title = "Extra Round"
	r.are_poets_from_previous = false
	r.time_limit = params[:time_limit]
	r.grace_period = params[:grace_period]

	if r.save
	  render json: {:result => true, :round => r}

	  event_hash = {};
	  event_hash[:event] = "new_round"
	  event_hash[:web_sock_id] = params[:web_sock_id]
	  event_hash[:round] = r

	  new_event(competition, event_hash)

	else
	  render json: {:result => false, :message => "Something went wrong"}
	end
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
	render json: {:result => false, :message => "Could not find round_id '" + params[:round_id] + "'"}
	return
      end

      host = Host.where(host: request.host).take
      poet = host.organization.poets.where(name: params[:name]).first

      if poet == nil
	render json: {:result => false, :message => "Could not find poet '" + params[:name] + "'"}
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


	render json: {:result  => true, :message => "New performance: " + params[:name], :performance_id => performance.id}    

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


	message = "Judge " + (judge_name.to_i + 1).to_s + " updated to: " + judge.value.to_s
	render json: {:result => true, :message => message, :judge => judge}

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
	message = "Time set: " + params[:minutes] + ":" + params[:seconds]
	render json: {:result => true, :message=> message, :performance => performance}

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
	message = "Penalty set to " + params[:penalty]
	render json: {:result => true, :message => message, :performance => performance}


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

      host = Host.where(host: request.host).take

      begin
	competition = host.organization.competitions.find(params[:competition_id])
      rescue
	render json: {:result => false, :message => "Could not find competition."}
	return
      end

      host = Host.where(host: request.host).take
      poet = host.organization.poets.where(name: params[:name]).take


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

      render json: {:result => true, :message => "Performance removed"}

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

      host = Host.where(host: request.host).take
      begin
	competition = host.organization.competitions.find(params[:competition_id])
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

      host = Host.where(host: request.host).take
      begin
	competition = host.organization.competitions.find(params[:competition_id])
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

      host = Host.where(host: request.host).take
      begin
	competition = host.organization.competitions.find(params[:competition_id])
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

      host = Host.where(host: request.host).take
      begin
	competition = host.organization.competitions.find(params[:competition_id])
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

      host = Host.where(host: request.host).take
      begin
	competition = host.organization.competitions.find(competition_id)
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


	# Update host.organization.competitions
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


    def browsers_reload


      if not_allowed() 
	return
      else
      	ChatDemo::ChatBackend.ask_browsers_to_reload
	render nothing: true, status: :ok, content_type: "text/html"
      end


    end

  #------------------------------------------------------------------------------------#

  def clone_slam

    if not_allowed()
      return
    end

    if missing_params(params, ['competition_id', 'title'])
      return
    end

    begin
      slam = Competition.find(params[:competition_id])
    rescue
      render json: {:result => false, :message => "Could not find competition to clone."}
      return
    end

    new_slam = slam.dup
    new_slam.title = params[:title]
    new_slam.event_number = 0
    new_slam.is_template = false
    if not new_slam.save
      render json: {:result => false, :message => "Could not save competition to database."}
    end
    
    slam.rounds.each do |round|
      new_round = round.dup
      new_round.competition_id = new_slam.id
      if not new_round.save
	render json: {:result => false, :message => "Could not save round to database."}
      end
    end

    render json: {:result => true, :message => "Cloned slam", new_slam => new_slam}

  end
  #------------------------------------------------------------------------------------#


end

