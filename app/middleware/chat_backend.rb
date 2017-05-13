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

			$subscribers = {} 
			$competition_ids = {}

		end

		def self.hello(data)
			Thread.new {
				$clients.each {|client| client.send(data.to_json) }
			}
		end

		def self.broadcast_number_of_clients
			data = {:type => "metrics", :total_connections => $clients.length}

			p ['number of connections', $clients.length]
			ChatDemo::ChatBackend.hello(data)
		end


		def self.ask_browsers_to_reload

			# Use this when you need browsers to reload (probably because you made changes to a Competition)

			data = {:type => "reload"}

			p data

			ChatDemo::ChatBackend.hello(data)
		end


		def add_subscriber(ws, competition_id)

			delete_subscriber (ws)

			$subscribers[ws] = competition_id

			if $competition_ids[competition_id] == nil
				$competition_ids[competition_id] = []
			end
			$competition_ids[competition_id] << ws
			broadcast_total_subscribers(competition_id)
		end

		def delete_subscriber(ws)
			competition_id = $subscribers[ws]
			$subscribers.delete(ws)

			if competition_id != nil
				$competition_ids[competition_id].delete(ws)
				p ['Number of subscribers for ', competition_id, $competition_ids[competition_id].length]
			end
			broadcast_total_subscribers(competition_id)
		end

		def broadcast_to_subscribers(competition_id, data)
			Thread.new {
				$competition_ids[competition_id].each{|ws| ws.send(data.to_json)}
			}
		end

		def broadcast_total_subscribers(competition_id)

			subscribers = $competition_ids[competition_id]

			if subscribers == nil
				return
			end

			total_subscribers = subscribers.length

			if total_subscribers > 0
				data = {:type => "subscribers", :total_subscribers => total_subscribers}
				broadcast_to_subscribers(competition_id, data)
			end
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

					begin
						message = JSON.parse(event.data);

						if message["type"] == "total_connections"
							data = {:type => "metrics", :total_connections => $clients.length}
							ws.send(data.to_json);
						end


						# Only logged in users may send messages
						if message["type"] == "subscribe"

							competition_id = message['competition_id'].to_i
							p ['subscribe', competition_id]
							add_subscriber(ws, competition_id)
							p ['Number of subscribers for ', competition_id, $competition_ids[competition_id].length]

						end

						if message["type"] == "heads_up"
							if LoggedIn.where(key: message["key"]).count != 0
								$clients.each {|client| client.send(message.except('key').to_json) }
							end
						end
					rescue
					end
				end

				ws.on :close do |event|
					p [:close, ws.object_id, event.code, event.reason]
					delete_subscriber(ws)
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


	def self.summer_playoffs(title)

		c = Competition.create(title: title,
							   event_number: 0,
							   num_judges: 5, 
							   do_not_include_min_and_max_scores: true,
							   organization_id: 1)

		Round.create(competition_id: c.id, 
					 round_number: 1, 
					 title: "Sacrifice 1", 
					 are_poets_from_previous: false, 
					 time_limit: 60, 
					 grace_period: 10, 
					 num_poets: 1)

		Round.create(competition_id: c.id, 
					 round_number: 2, 
					 title: "Sacrifice 2", 
					 are_poets_from_previous: false, 
					 time_limit: 60, 
					 grace_period: 10, 
					 num_poets: 1)

		Round.create(competition_id: c.id, 
					 round_number: 3, 
					 title: "Round 1", 
					 are_poets_from_previous: false, 
					 time_limit: 60, 
					 grace_period: 10, 
					 num_places: 8, 
					 num_poets: 10)

		Round.create(competition_id: c.id, 
					 round_number: 4, 
					 title: "Round 2", 
					 are_poets_from_previous: true, 
					 time_limit: 120, 
					 grace_period: 10, 
					 num_places: 6,
					 is_cumulative: true)

		Round.create(competition_id: c.id, 
					 round_number: 5, 
					 title: "Round 3", 
					 are_poets_from_previous: true, 
					 time_limit: 180, 
					 grace_period: 10, 
					 num_places: 4,
					 is_cumulative: true)

		Round.create(competition_id: c.id, 
					 round_number: 6, 
					 title: "Round 4", 
					 are_poets_from_previous: true, 
					 time_limit: 240, 
					 grace_period: 10, 
					 is_cumulative: true)
	end

	def self.new_summer_slam(title) 

		c = Competition.create(title: title, 
							   event_number: 0, 
							   num_judges: 5, 
							   do_not_include_min_and_max_scores: true,
							   organization_id: 1)

		Round.create(competition_id: c.id, 
					 round_number: 1, 
					 title: "Sacrifical Round", 
					 are_poets_from_previous: false, 
					 time_limit: 120, 
					 grace_period: 10, 
					 num_poets: 1)

		Round.create(competition_id: c.id, 
					 round_number: 2, 
					 title: "Round 1", 
					 are_poets_from_previous: false, 
					 time_limit: 120, 
					 grace_period: 10, 
					 num_places: 6, 
					 num_poets: 12)

		Round.create(competition_id: c.id, 
					 round_number: 3, 
					 title: "Round 2", 
					 are_poets_from_previous: true, 
					 time_limit:  60, 
					 grace_period: 10, 
					 num_places: 3)

		Round.create(competition_id: c.id, 
					 round_number: 4, 
					 title: "Round 3", 
					 are_poets_from_previous: true , 
					 time_limit: 240, 
					 grace_period: 10)

	end

	def self.verses_thursday(title)

		c = Competition.create(event_number: 0, num_judges: 5, do_not_include_min_and_max_scores:true, organization_id: 2)
		c.title = title
		c.season_id = 2
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
		c.season_id = 2
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
		c.title = "Saturday, April 29, 7pm FINAL STAGE, The Reo Theatre"
		c.season_id = 2
		c.save

		Round.create(competition_id: c.id,
					 round_number: 1,
					 title: "Sacrificial Round",
					 time_limit: 3 * 60,
					 grace_period: 20,
					 num_poets: 1)

		Round.create(competition_id: c.id,
					 round_number: 2,
					 title: "Round 1",
					 time_limit: 3 * 60, 
					 grace_period: 20,
					 num_places: 7)

		Round.create(competition_id: c.id, 
					 round_number: 3,
					 title: "Sacrificial Round",
					 time_limit: 3 * 60,
					 grace_period: 20,
					 num_poets: 1)

		Round.create(competition_id: c.id,
					 round_number: 4,
					 title: "Round 2",
					 time_limit: 3 * 60,
					 grace_period: 20,
					 are_poets_from_previous: true,
					 previous_round_number: 2,
					 num_places: 4)

		Round.create(competition_id: c.id,
					 round_number: 5,
					 title: "Sacrificial Round",
					 time_limit: 3 * 60, 
					 grace_period: 20,
					 num_poets: 1)

		Round.create(competition_id: c.id,
					 round_number: 6,
					 title: "Round 3",
					 time_limit: 3 * 60,
					 grace_period: 20,
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

		c = Competition.create(title: title, 
							   event_number: 0, 
							   num_judges: 5, 
							   do_not_include_min_and_max_scores: true, 
							   organization_id: 1)

		Round.create(competition_id: c.id, 
					 round_number: 1, 
					 title: "Sacrifical Round", 
					 are_poets_from_previous: false, 
					 time_limit: 180, 
					 grace_period: 10,
					 num_poets: 1)

		Round.create(competition_id: c.id, 
					 round_number: 2, 
					 title: "Round 1", 
					 are_poets_from_previous: false, 
					 time_limit: 180, 
					 grace_period: 10, 
					 num_places: 5) 

		Round.create(competition_id: c.id, 
					 round_number: 3, 
					 title: "Round 2", 
					 are_poets_from_previous: true, 
					 time_limit: 180, 
					 grace_period: 10, 
					 is_cumulative: true)
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
	end


	def self.mitch

		mitch1 = Poet.where(name: 'Mitcholos').take
		mitch2 = Poet.where(name: 'Mitcholos Touchie').take

		performances = Performance.where(:poet_id => [mitch1.id, mitch2.id])

		sum = 0
		count = 0

		performances.each do |p|

			p.judges.each do |j|

				sum = sum + j.value
				count = count + 1
			end

		end

		p ['sum', sum, 'count', count]
		p ['average', sum / count]

	end


	def self.average_score(name)

		poet = Poet.where('name = ?', name).take

		performances = Performance.where(poet_id: poet.id)

		sum = 0
		count = 0

		performances.each do |p|

			p.judges.each do |j|

				sum = sum + j.value
				count = count + 1
			end

		end

		p ['sum', sum, 'count', count]
		p ['average', sum / count]

	end

end

module CleanUp

	def self.find_orphan_judges

		orphans = []
		p "Looking for orphan judges"

		Judge.all.each do |judge|

			if not Performance.exists?(:id => judge.performance_id)
				orphans << judge
			end
		end

		p "Found " + orphans.size.to_s + " orphan judge(s)"

		orphans
	end

	def self.find_orphan_performances

		orphans = []
		p "Looking for orphan performances"

		Performance.all.each do |performance|

			if not Round.exists?(:id => performance.round_id)
				orphans << performance
			end
		end

		p "Found " + orphans.size.to_s + " orphan performance(s)"

		orphans
	end

	def self.find_orphan_rounds

		orphans = []
		p "Looking for orphan rounds"

		Round.all.each do |round|

			if not Competition.exists?(:id => round.competition_id)
				orphans << round
			end
		end

		p "Found " + orphans.size.to_s + " orphan round(s)"

		orphans
	end

	def self.delete_orphan_judges

		orphans = find_orphan_judges

		orphans.each do |judge|
			judge.delete
		end
	end


	def self.delete_orphan_performances

		orphans = find_orphan_performances

		orphans.each do |performance|
			performance.delete
		end
	end

	def self.delete_orphan_rounds

		orphans = find_orphan_rounds

		orphans.each do |round|
			round.delete
		end
	end

	def self.delete_all_orpans

		delete_orphan_rounds
		delete_orphan_performances
		delete_orphan_judges
	end

end



