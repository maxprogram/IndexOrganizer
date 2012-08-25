class CreateLetters < ActiveRecord::Migration
  def change
    create_table :letters do |t|
      t.decimal :level
      t.integer :name
      t.string :pages

      t.timestamps
    end
  end
end
