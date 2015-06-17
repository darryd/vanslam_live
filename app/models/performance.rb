class Performance < ActiveRecord::Base
  belongs_to :poet
  belongs_to :round
  has_many :judges

  has_one :previous_performance, class_name: "Performance", foreign_key: "id"
end
