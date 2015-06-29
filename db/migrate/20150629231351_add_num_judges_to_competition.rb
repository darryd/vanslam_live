class AddNumJudgesToCompetition < ActiveRecord::Migration
  def change
    add_column :competitions, :num_judges, :integer
  end
end
