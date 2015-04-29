class CreateRounds < ActiveRecord::Migration
  def change
    create_table :rounds do |t|
      t.integer :num_poets
      t.boolean :is_cumulative

      t.timestamps null: false
    end
  end
end
