class AdjustController < ApplicationController

  def create
    page = params[:input_page]
    pages = params[:input_pages]
    letters = Letter.all
    
    letters.each do |ref|
      if ref.pages.to_i > page.to_i
        newnum = ref.pages.to_i + pages.to_i
      else
        newnum = ref.pages.to_i
      end
      ref.update_attribute(:pages,newnum)
    end
    redirect_to "/"
  end

end