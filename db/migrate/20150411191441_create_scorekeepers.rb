class CreateScorekeepers < ActiveRecord::Migration
  def change
    create_table :scorekeepers do |t|

      t.timestamps null: false
    end
  end
end
