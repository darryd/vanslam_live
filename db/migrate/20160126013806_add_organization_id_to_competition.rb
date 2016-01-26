class AddOrganizationIdToCompetition < ActiveRecord::Migration
  def change
    add_column :competitions, :organization_id, :integer
  end
end
