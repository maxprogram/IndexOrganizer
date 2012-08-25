class CreateCompanies < ActiveRecord::Migration
  def change
    create_table :companies do |t|
      t.decimal :level
      t.string :name
      t.string :pages

      t.timestamps
    end
  end
end
