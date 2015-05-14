class CreatePerformances < ActiveRecord::Migration
  def change
    create_table :performances do |t|
      t.integer :poet_id
      t.integer :round_id

      t.timestamps null: false
    end
  end
end
