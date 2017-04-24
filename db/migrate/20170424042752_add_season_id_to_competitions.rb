class AddSeasonIdToCompetitions < ActiveRecord::Migration
  def change
    add_column :competitions, :season_id, :integer
  end
end
