class Organization < ActiveRecord::Base
  has_many :hosts
  has_many :competitions
  has_many :poets
end
