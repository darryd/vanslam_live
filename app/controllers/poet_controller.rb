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


  # Returns poet id.
  #
  # This will return the id of the the poet with 'name'.
  # If no such poet exists, one will be created.
  #

  # TODO Read http://rails-sqli.org/

  def create_or_get(name)

    Poet.transcation do

      poet = Poet.where("lower(name) = ?", name.downcase).take

      if poet == nil	
	poet = Poet.new(name: name)
	poet.save
      end

      poet.id
    end
  end

  #------------------------------------------------------------------------------------#
  
  def post_create_or_get

    if not is_logged_in()
      render json: {:result => "You must be logged in to do that."}
      return
    end

    render json: {:result => "Thanks you"}

  end
  #------------------------------------------------------------------------------------#


end
