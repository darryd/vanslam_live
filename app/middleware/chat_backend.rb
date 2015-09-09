require 'faye/websocket'

Faye::WebSocket.load_adapter('thin')


module Darry

  def Darry.hello
    p "hello"
  end
end


module ChatDemo
  class ChatBackend

    #include ChatDemo

    KEEPALIVE_TIME = 15 # in seconds
    CHANNEL        = "chat-demo"

    def initialize(app)
      @app     = app
      $clients = []
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

  def self.new_winter_slam(title)

    c = Competition.create(title: title, event_number: 0, num_judges: 5, do_not_include_min_and_max_scores: true)

    Round.create(competition_id: c.id, round_number: 1, title: "Sacrifical Round", are_poets_from_previous: false, time_limit: 180)
    Round.create(competition_id: c.id, round_number: 2, title: "Round 1", are_poets_from_previous: false, time_limit: 180, num_places: 5) 
    Round.create(competition_id: c.id, round_number: 3, title: "Round 2", are_poets_from_previous: true, time_limit: 180, is_cumulative: true)
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

    Round.create(competition_id: c.id, round_number: 3, title: "Round 1", are_poets_from_previous: false, time_limit: 60, num_places: 8) 
    Round.create(competition_id: c.id, round_number: 4, title: "Round 2", are_poets_from_previous: true, time_limit: 120, num_places: 6, is_cumulative: true)
    Round.create(competition_id: c.id, round_number: 5, title: "Round 3", are_poets_from_previous: true, time_limit: 180, num_places: 4,is_cumulative: true)
    Round.create(competition_id: c.id, round_number: 6, title: "Round 4", are_poets_from_previous: true, time_limit: 240, is_cumulative: true)

    # Extra Round in case of a tie at the end... 
    # round_number = 0 will be the extra round
    Round.create(competition_id: c.id, round_number: 7, title: "Extra Round", are_poets_from_previous: false, time_limit: 180, is_extra: true)

  end

end
