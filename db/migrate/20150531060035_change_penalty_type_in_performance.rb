class ChangePenaltyTypeInPerformance < ActiveRecord::Migration
  def change
    change_column :performances, :penalty, :float
  end
end
