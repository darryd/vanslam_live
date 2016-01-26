class Organization < ActiveRecord::Base
  has_many :hosts
end
