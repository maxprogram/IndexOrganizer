class HomeController < ApplicationController
  def index
  end

  def about
  end
  
  def topics
    render :json => Topic.all
  end
end
