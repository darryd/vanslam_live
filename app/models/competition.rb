class Competition < ActiveRecord::Base
  belongs_to :organization
  belongs_to :season
  has_many :rounds
  has_many :events
end
