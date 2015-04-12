class AddPasswordDigestToScorekeepers < ActiveRecord::Migration
  def change
    add_column :scorekeepers, :password_digest, :string
  end
end
