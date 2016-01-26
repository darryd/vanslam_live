class CreateHosts < ActiveRecord::Migration
  def change
    create_table :hosts do |t|
      t.integer :organization_id
      t.string :host

      t.timestamps null: false
    end
  end
end
