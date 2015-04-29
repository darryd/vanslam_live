class RemoveCompetitionIdFromRound < ActiveRecord::Migration
  def change
    remove_column :rounds, :competition_id

  end
end
