class HomeController < ApplicationController
  def index
  end

  def about
  end

  def letters
  	@letters = Letter.find(:all, order: 'level')
  	array = []
  	@string = "{"

  	@letters.each do |i|
  		array.push(i.name.to_s() + " => " + i.pages.to_s())
  	end

  	@string += array.join(", ") + "}"

  end
  

end
