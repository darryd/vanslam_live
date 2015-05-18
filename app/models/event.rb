class Event < ActiveRecord::Base
  belongs_to :competition
  belongs_to :scorekeeper
end
