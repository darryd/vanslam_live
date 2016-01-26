class RemoveWebSockUirFromOrganization < ActiveRecord::Migration
  def change
    remove_column :organizations, :web_sock_uir, :string
  end
end
