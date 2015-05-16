class Performance < ActiveRecord::Base
  belongs_to :poet
  belongs_to :round
  has_many :judges
end
