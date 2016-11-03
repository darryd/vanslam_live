class RemoveIsExtraFromRound < ActiveRecord::Migration
  def change
    remove_column :rounds, :is_extra, :boolean
  end
end
