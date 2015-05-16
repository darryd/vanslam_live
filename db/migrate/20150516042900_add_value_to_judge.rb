class AddValueToJudge < ActiveRecord::Migration
  def change
    add_column :judges, :value, :float
  end
end
