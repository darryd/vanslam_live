class AddIsTemplateToCompetition < ActiveRecord::Migration
  def change
    add_column :competitions, :is_template, :boolean
  end
end
