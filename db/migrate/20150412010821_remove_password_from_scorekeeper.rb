class RemovePasswordFromScorekeeper < ActiveRecord::Migration
  def change
    remove_column :scorekeepers, :password
  end
end
