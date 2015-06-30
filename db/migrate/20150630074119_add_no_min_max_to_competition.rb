class AddNoMinMaxToCompetition < ActiveRecord::Migration
  def change
    add_column :competitions, :no_min_max, :boolean
  end
end
