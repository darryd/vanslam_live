class Organization < ActiveRecord::Base
  has_many :hosts
  has_many :competitions
end
