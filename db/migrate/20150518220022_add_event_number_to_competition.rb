class AddEventNumberToCompetition < ActiveRecord::Migration
  def change
    add_column :competitions, :event_number, :integer
  end
end
