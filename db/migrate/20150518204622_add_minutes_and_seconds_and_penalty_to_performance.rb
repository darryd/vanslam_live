class AddMinutesAndSecondsAndPenaltyToPerformance < ActiveRecord::Migration
  def change
    add_column :performances, :minutes, :integer
    add_column :performances, :seconds, :integer
    add_column :performances, :penalty, :integer
  end
end
