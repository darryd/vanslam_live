class AddArePoetsFromPreviousToRounds < ActiveRecord::Migration
  def change
    add_column :rounds, :are_poets_from_previous, :boolean
  end
end
