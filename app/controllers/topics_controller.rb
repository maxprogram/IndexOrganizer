class TopicsController < ApplicationController
  
  def index
    render :json => Topic.all
  end
  
  def create
    topic = Topic.create(params[:topic])
    render :json => topic
  end
  
  def update
    topic = Topic.find(params[:id])
    topic.update_attributes({ level:  params[:level],
                              name:   params[:name],
                              pages:  params[:pages]
    })
    render :json => topic
  end
  
  def destroy
    topic = Topic.find(params[:id])
    topic.destroy
    render :json => topic
  end

end
