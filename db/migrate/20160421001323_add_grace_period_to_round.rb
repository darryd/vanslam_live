class AddGracePeriodToRound < ActiveRecord::Migration
  def change
    add_column :rounds, :grace_period, :integer
  end
end
