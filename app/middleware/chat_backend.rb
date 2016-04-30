require 'faye/websocket'

Faye::WebSocket.load_adapter('thin')


module Darry

  def Darry.hello
    p "hello"
  end
end


#http://stackoverflow.com/a/27010181
#random_string = ('0'..'z').to_a.shuffle.first(8).join

module ChatDemo
  class ChatBackend

    #include ChatDemo

    KEEPALIVE_TIME = 15 # in seconds
    CHANNEL        = "chat-demo"

    def initialize(app)
      @app     = app
      $clients = []

      $sessions = {}
    end

    def self.hello(data)
      $clients.each {|client| client.send(data.to_json) }
    end

    def self.broadcast_number_of_clients
      data = {}
      data = {:type => "metrics", :total_connections => $clients.length}

      p ['number of connections', $clients.length]
      ChatDemo::ChatBackend.hello(data)
    end


    def self.ask_browsers_to_reload
      
      # Use this when you need browsers to reload (probably because you made changes to a Competition)

      data = {}
      data = {:type => "reload"}

      p data

      ChatDemo::ChatBackend.hello(data)

    end


    def call(env)

      if Faye::WebSocket.websocket?(env)
	ws = Faye::WebSocket.new(env, nil, {ping: KEEPALIVE_TIME })
	ws.on :open do |event|
	  p [:open, ws.object_id]
	  $clients << ws
	  ChatDemo::ChatBackend.broadcast_number_of_clients()
	end

	ws.on :message do |event|
	  p [:message, event.data]
#	  $clients.each {|client| client.send(event.data) }
	end

	ws.on :close do |event|
	  p [:close, ws.object_id, event.code, event.reason]
	  $clients.delete(ws)
	  ws = nil
	  ChatDemo::ChatBackend.broadcast_number_of_clients()
	end

	# Return async Rack response
	ws.rack_response

      else
	@app.call(env)
      end
    end
  end
end


#TODO This module should be somewhere else
# It really shouldn't be here

module MakeSlam
  def self.hello 
    p "hello"
  end

  def self.new_summer_slam(title) 

    c = Competition.create(title: title, event_number: 0, num_judges: 5, do_not_include_min_and_max_scores: true)

    Round.create(competition_id: c.id, round_number: 1, title: "Sacrifical Round", are_poets_from_previous: false, time_limit: 120)
    Round.create(competition_id: c.id, round_number: 2, title: "Round 1", are_poets_from_previous: false, time_limit: 120, num_places: 6)
    Round.create(competition_id: c.id, round_number: 3, title: "Round 2", are_poets_from_previous: true , time_limit:  60, num_places: 3)
    Round.create(competition_id: c.id, round_number: 4, title: "Round 3", are_poets_from_previous: true , time_limit: 240)

  end

  def self.verses_thursday(title)

    c = Competition.create(event_number: 0, num_judges: 5, do_not_include_min_and_max_scores:true, organization_id: 2)
    c.title = title
    c.save

    Round.create(competition_id: c.id,
		 round_number: 1,
		 title: "Sacrificial Round",
		 time_limit: 4 * 60,
		 grace_period: 10,
		 num_poets: 1)

    Round.create(competition_id: c.id,
		 round_number: 2,
		 title: "Round 1",
		 time_limit: 4 * 60, 
		 grace_period: 10)

    Round.create(competition_id: c.id, 
		 round_number: 3,
		 title: "Sacrificial Round",
		 time_limit: 60,
		 grace_period: 10,
		 num_poets: 1)

    Round.create(competition_id: c.id,
		 round_number: 4,
		 title: "Round 2",
		 time_limit: 60,
		 grace_period: 10)
  end

  def self.verses_friday(title)

    c = Competition.create(event_number: 0, num_judges: 5, do_not_include_min_and_max_scores:true, organization_id: 2)
    c.title = title
    c.save

    Round.create(competition_id: c.id,
		 round_number: 1,
		 title: "Sacrificial Round",
		 time_limit: 2 * 60,
		 grace_period: 10,
		 num_poets: 1)

    Round.create(competition_id: c.id,
		 round_number: 2,
		 title: "Round 1",
		 time_limit: 2 * 60, 
		 grace_period: 10)

    Round.create(competition_id: c.id, 
		 round_number: 3,
		 title: "Sacrificial Round",
		 time_limit: 3 * 60,
		 grace_period: 10,
		 num_poets: 1)

    Round.create(competition_id: c.id,
		 round_number: 4,
		 title: "Round 2",
		 time_limit: 3 * 60,
		 grace_period: 10)
  end

  def self.verses_saturday

    c = Competition.create(event_number: 0, num_judges: 5, do_not_include_min_and_max_scores:true, organization_id: 2)
    c.title = "April 30th (finals)"
    c.save

    Round.create(competition_id: c.id,
		 round_number: 1,
		 title: "Sacrificial Round",
		 time_limit: 3 * 60 + 10,
		 grace_period: 10,
		 num_poets: 1)

    Round.create(competition_id: c.id,
		 round_number: 2,
		 title: "Round 1",
		 time_limit: 3 * 60 + 10, 
		 grace_period: 10,
		 num_places: 7)

    Round.create(competition_id: c.id, 
		 round_number: 3,
		 title: "Sacrificial Round",
		 time_limit: 3 * 60 + 10,
		 grace_period: 10,
		 num_poets: 1)

    Round.create(competition_id: c.id,
		 round_number: 4,
		 title: "Round 2",
		 time_limit: 3 * 60 + 10,
		 grace_period: 10,
		 are_poets_from_previous: true,
		 previous_round_number: 2,
		 num_places: 4)

    Round.create(competition_id: c.id,
		 round_number: 5,
		 title: "Sacrificial Round",
		 time_limit: 3 * 60 + 10, 
		 grace_period: 10,
		 num_poets: 1)

    Round.create(competition_id: c.id,
		 round_number: 6,
		 title: "Round 3",
		 time_limit: 3 * 60 + 10,
		 grace_period: 10,
		 are_poets_from_previous: true,
		 previous_round_number: 4)
  end

  def self.finals

    c = Competition.create(event_number: 0, num_judges: 5, do_not_include_min_and_max_scores:true, organization_id: 1)
    c.title = "Van Slam Finals Night 2016"
    c.save

    Round.create(competition_id: c.id,
		 round_number: 1, 
		 title: "Sacrificial Round",
		 are_poets_from_previous: false,
		 time_limit: 3 * 60, 
		 grace_period: 20)

    Round.create(competition_id: c.id,
		 round_number: 2,
		 title: "Round 1",
		 are_poets_from_previous: false,
		 time_limit: 180, 
		 grace_period: 20,
		 num_places: 100)

    Round.create(competition_id: c.id,
		 round_number: 3,
		 title: "Round 2",
		 are_poets_from_previous: true, 
		 time_limit: 60, 
		 grace_period: 20, 
		 num_places: 100,
		 is_cumulative: true)

    Round.create(competition_id: c.id,
		 round_number: 4,
		 title: "Round 3",
		 are_poets_from_previous: true,
		 time_limit: 180, 
		 grace_period: 20,
		 is_cumulative: true)

  end



  def self.new_winter_slam(title)

    c = Competition.create(title: title, event_number: 0, num_judges: 5, do_not_include_min_and_max_scores: true, organization_id: 1)

    Round.create(competition_id: c.id, round_number: 1, title: "Sacrifical Round", are_poets_from_previous: false, time_limit: 180, grace_period: 10)
    Round.create(competition_id: c.id, round_number: 2, title: "Round 1", are_poets_from_previous: false, time_limit: 180, grace_period: 10, num_places: 5) 
    Round.create(competition_id: c.id, round_number: 3, title: "Round 2", are_poets_from_previous: true, time_limit: 180, grace_period: 10, is_cumulative: true)
  end

  def self.new_windsor_slam(title)
    c = Competition.create(title: title, event_number: 0, num_judges: 3)

    Round.create(competition_id: c.id, round_number: 1, title: "Sacrifical Round", are_poets_from_previous: false, time_limit: 180)
    Round.create(competition_id: c.id, round_number: 2, title: "Round 1", are_poets_from_previous: false, time_limit: 180, num_places: 5) 
    Round.create(competition_id: c.id, round_number: 3, title: "Round 2", are_poets_from_previous: true, time_limit: 180, is_cumulative: true)
  end
  
  def self.new_playoffs

    title = "Vancouver Individual Poetry Slam Playoffs"
    c = Competition.create(title: title, event_number: 0, num_judges: 5, do_not_include_min_and_max_scores: true)

    Round.create(competition_id: c.id, round_number: 1, title: "Sacrificial Round 1", are_poets_from_previous: false, time_limit: 60)
    Round.create(competition_id: c.id, round_number: 2, title: "Sacrificial Round 2", are_poets_from_previous: false, time_limit: 60)
    Round.create(competition_id: c.id, round_number: 3, title: "Sacrificial Round 3", are_poets_from_previous: false, time_limit: 180) 


    Round.create(competition_id: c.id, round_number: 4, title: "Round 1", are_poets_from_previous: false, time_limit: 60, num_places: 8) 
    Round.create(competition_id: c.id, round_number: 5, title: "Round 2", are_poets_from_previous: true, time_limit: 120, num_places: 6, is_cumulative: true)
    Round.create(competition_id: c.id, round_number: 6, title: "Round 3", are_poets_from_previous: true, time_limit: 180, num_places: 4,is_cumulative: true)
    Round.create(competition_id: c.id, round_number: 7, title: "Round 4", are_poets_from_previous: true, time_limit: 240, is_cumulative: true)

    # Extra Round in case of a tie at the end... 
    # round_number = 0 will be the extra round
  #  Round.create(competition_id: c.id, round_number: 7, title: "Extra Round", are_poets_from_previous: false, time_limit: 180, is_extra: true)

  end

end
