class Competition < ActiveRecord::Base
  has_many :rounds
  has_many :events
end
