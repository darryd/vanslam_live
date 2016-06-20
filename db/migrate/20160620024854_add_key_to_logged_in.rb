class AddKeyToLoggedIn < ActiveRecord::Migration
  def change
    add_column :logged_ins, :key, :string
  end
end
