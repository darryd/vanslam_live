class Season < ActiveRecord::Base
  belongs_to :organization
  has_many :competitions
end
