class AddWebSockUriToSettings < ActiveRecord::Migration
  def change
    add_column :settings, :web_sock_uri, :string
  end
end
