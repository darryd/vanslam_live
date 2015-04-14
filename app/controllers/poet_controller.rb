class PoetController < ApplicationController
  def names

    names = []

    Poet.find_each do |poet|
      names << poet.name
    end

    render json: {:names => names}
  end
end
