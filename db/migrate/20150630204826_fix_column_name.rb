class FixColumnName < ActiveRecord::Migration
  def change
    rename_column :competitions, :no_min_max, :do_not_include_min_and_max_scores
  end
end
