class Poet < ActiveRecord::Base
  validates_uniqueness_of :name
end
