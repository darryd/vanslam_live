class AddOrganizationIdToSeasons < ActiveRecord::Migration
  def change
    add_column :seasons, :organization_id, :integer
  end
end
