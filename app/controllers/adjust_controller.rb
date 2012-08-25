class AdjustController < ApplicationController

  def create
    page = params[:input_page]
    pages = params[:input_pages]
    topics = Topic.all + Company.all + Person.all

    topics.each do |ref|
      arr = []
      ref.pages.split(",").each do |n|
        if n.to_i > page.to_i
          newnum = n.to_i + pages.to_i
        else
          newnum = n.to_i
        end
        arr.push(newnum)
      end
      ref.update_attribute(:pages,arr.join(", "))
    end
    redirect_to "/"
  end

end