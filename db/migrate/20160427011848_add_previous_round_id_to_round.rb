class AddPreviousRoundIdToRound < ActiveRecord::Migration
  def change
    add_column :rounds, :previous_round_id, :integer
  end
end
