class FixPasswordColumnName < ActiveRecord::Migration
  def change
    rename_column :scorekeepers, :passwd, :password
  end
end
