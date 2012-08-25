class DropTables < ActiveRecord::Migration
  def up
    drop_table :persons
    drop_table :companys
  end

  def down
  end
end
