class HomeController < ApplicationController
  respond_to :html, :txt

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
    render :text => @string
  end

  def csv
    @t = params[:t]
    @csv = ""

    if @t == "topics"
      @table = Topic.find(:all, order: 'level')
      @table.each do |i|
        @csv += i.level.to_s() + "\t" +
          i.name + "\t" +
          i.pages + "\n"
      end
    end

    if @t == "people"
      @table = Person.all
      @table.each do |i|
        arr = i.name.split
        first = arr.shift
        name = arr.join(" ") + ", " + first
        @csv += name + "\t" + i.pages + "\n"
      end
    end

    if @t == "companies"
      @table = Company.find(:all, order: 'name')
      @table.each do |i|
        @csv += i.name + "\t" + i.pages + "\n"
      end
    end

    render 'csv', :formats => :txt
    # send_data @csv, :type => "text/csv", :disposition => "inline"
  end

end
