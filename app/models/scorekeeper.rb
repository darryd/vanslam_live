class Scorekeeper < ActiveRecord::Base
  has_secure_password
  validates_uniqueness_of :user_name
  has_many :events
end
