class Round < ActiveRecord::Base
  belongs_to :competition
  has_many :performances

  has_one :previous_round, class_name: "Round", foreign_key: "id"
end
