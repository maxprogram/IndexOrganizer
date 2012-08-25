class CompaniesController < ApplicationController
  
  def index
    render :json => Company.all
  end
  
  def create
    company = Company.create(params[:company])
    render :json => company
  end
  
  def update
    company = Company.find(params[:id])
    company.update_attributes({ level:  params[:level],
                              name:   params[:name],
                              pages:  params[:pages]
    })
    render :json => company
  end
  
  def destroy
    company = Company.find(params[:id])
    company.destroy
    render :json => company
  end

end
