class AddOrganizationIdToPoet < ActiveRecord::Migration
  def change
    add_column :poets, :organization_id, :integer
  end
end
