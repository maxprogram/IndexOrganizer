class CreatePeople < ActiveRecord::Migration
  def change
    create_table :people do |t|
      t.decimal :level
      t.string :name
      t.string :pages

      t.timestamps
    end
  end
end
