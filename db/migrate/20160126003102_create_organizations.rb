class CreateOrganizations < ActiveRecord::Migration
  def change
    create_table :organizations do |t|
      t.string :name
      t.string :title
      t.string :web_sock_uir

      t.timestamps null: false
    end
  end
end
