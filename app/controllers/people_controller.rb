class PeopleController < ApplicationController
  
  def index
    render :json => Person.all
  end
  
  def create
    person = Person.create(params[:person])
    render :json => person
  end
  
  def update
    person = Person.find(params[:id])
    person.update_attributes({level:  params[:level],
                              name:   params[:name],
                              pages:  params[:pages]
    })
    render :json => person
  end
  
  def destroy
    person = Person.find(params[:id])
    person.destroy
    render :json => person
  end

end
