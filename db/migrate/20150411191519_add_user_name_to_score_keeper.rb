class AddUserNameToScoreKeeper < ActiveRecord::Migration
  def change
    add_column :scorekeepers, :user_name, :string
    add_column :scorekeepers, :passwd, :string
  end
end
