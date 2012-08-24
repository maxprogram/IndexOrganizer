class CreateTopics < ActiveRecord::Migration
  def change
    create_table :topics do |t|
      t.integer :level
      t.string :name
      t.string :pages

      t.timestamps
    end
  end
end
