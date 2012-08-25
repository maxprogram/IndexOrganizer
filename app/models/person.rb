# == Schema Information
#
# Table name: people
#
#  id         :integer          not null, primary key
#  level      :decimal(, )
#  name       :string(255)
#  pages      :string(255)
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Person < ActiveRecord::Base
  attr_accessible :level, :name, :pages
  
  validates :name,  presence: true
  validates :level, presence: true
end
