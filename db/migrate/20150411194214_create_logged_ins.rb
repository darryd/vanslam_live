class CreateLoggedIns < ActiveRecord::Migration
  def change
    create_table :logged_ins do |t|
      t.integer :scorekeeper_id
      t.string :session_id

      t.timestamps null: false
    end
  end
end
