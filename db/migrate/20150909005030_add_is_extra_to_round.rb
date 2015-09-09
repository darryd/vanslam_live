class AddIsExtraToRound < ActiveRecord::Migration
  def change
    add_column :rounds, :is_extra, :boolean
  end
end
