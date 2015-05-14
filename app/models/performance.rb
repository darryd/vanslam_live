class Performance < ActiveRecord::Base
  belongs_to :poet
  belongs_to :round
end
