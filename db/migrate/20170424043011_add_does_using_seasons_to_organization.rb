class AddDoesUsingSeasonsToOrganization < ActiveRecord::Migration
  def change
    add_column :organizations, :is_using_seasons, :boolean
  end
end
