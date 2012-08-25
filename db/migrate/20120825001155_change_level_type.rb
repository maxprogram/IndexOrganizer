class ChangeLevelType < ActiveRecord::Migration
  def up
    change_column :topics, :level, :decimal
  end

  def down
  end
end
