class AddNumPlacesToRound < ActiveRecord::Migration
  def change
    add_column :rounds, :num_places, :integer
  end
end
