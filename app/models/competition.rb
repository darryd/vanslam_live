class Competition < ActiveRecord::Base
  belongs_to :organization
  has_many :rounds
  has_many :events
end
