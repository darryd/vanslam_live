class Round < ActiveRecord::Base
  belongs_to :competition
  has_many :performances
end
