class AddPreviousPerformanceToPerformance < ActiveRecord::Migration
  def change
    add_column :performances, :previous_performance_id, :integer
  end
end
