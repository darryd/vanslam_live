class CreatePoets < ActiveRecord::Migration
  def change
    create_table :poets do |t|
      t.string :name

      t.timestamps null: false
    end
  end
end
