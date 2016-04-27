class AddPreviousRoundNumberToRound < ActiveRecord::Migration
  def change
    add_column :rounds, :previous_round_number, :integer
  end
end
