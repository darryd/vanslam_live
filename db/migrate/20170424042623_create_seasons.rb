class CreateSeasons < ActiveRecord::Migration
  def change
    create_table :seasons do |t|
      t.string :title
    end
  end
end
