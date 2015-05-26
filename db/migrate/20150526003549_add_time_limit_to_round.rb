class AddTimeLimitToRound < ActiveRecord::Migration
  def change
    add_column :rounds, :time_limit, :integer
  end
end
