class Letter < ActiveRecord::Base
  attr_accessible :level, :name, :pages
  
  has_many :topics
  has_many :persons
  has_many :companys
  
  validates :name,  presence: true
  validates :level, presence: true
end
