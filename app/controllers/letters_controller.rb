class LettersController < ApplicationController
  
  def index
    render :json => Letter.all
  end
  
  def create
    letter = Letter.create(params[:letter])
    render :json => letter
  end
  
  def update
    letter = Letter.find(params[:id])
    letter.update_attributes({ level:  params[:level],
                              name:   params[:name],
                              pages:  params[:pages]
    })
    render :json => letter
  end
  
  def destroy
    letter = Letter.find(params[:id])
    letter.destroy
    render :json => letter
  end

end
