class CreateJudges < ActiveRecord::Migration
  def change
    create_table :judges do |t|
      t.integer :performance_id
      t.string :judge_name

      t.timestamps null: false
    end
  end
end
