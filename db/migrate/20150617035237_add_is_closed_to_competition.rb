class AddIsClosedToCompetition < ActiveRecord::Migration
  def change
    add_column :competitions, :is_closed, :boolean
  end
end
