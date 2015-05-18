class CreateEvents < ActiveRecord::Migration
  def change
    create_table :events do |t|
      t.integer :event_number
      t.integer :competition_id
      t.integer :scorekeeper_id
      t.string :event

      t.timestamps null: false
    end
  end
end
