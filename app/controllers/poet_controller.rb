class PoetController < ApplicationController
  #------------------------------------------------------------------------------------#
  def names

    names = []

    Poet.find_each do |poet|
      names << poet.name
    end

    render json: {:names => names}
  end

  #------------------------------------------------------------------------------------#
  
  def post_create_or_get

    if not is_logged_in()
      render json: {:result => false, :message => "You must be logged in to do that."}
      return
    end

    if not params.has_key?(:name)
      render json: {:result => false, :message => "Missing 'name' parameter."}
      return 
    end

    name = params[:name].gsub(/\s+/, " ").strip
    poet = Poet.where('lower(name) = ?', name.downcase).first_or_create(:name=>name)

    render json: {:result => true, :poet => poet}

  end
  #------------------------------------------------------------------------------------#

  def post_suggestions

    #TODO check params

    name = params[:name].downcase

    names = []

    poets = Poet.where("lower(name) like ?", "%#{name}%")

    limit = poets.length
    if params.has_key?(:limit)
      limit = params[:limit].to_i
    end
    limit = [limit, poets.length].min

    i = 0
    while i < limit
      names << poets[i].name
      i = i + 1
    end

    render json: {:name => name ,:names  => names}

  end
  #------------------------------------------------------------------------------------#


end
