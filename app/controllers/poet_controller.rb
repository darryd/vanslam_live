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

    if not params.has_key?(:name)
      render json: {:result => false, :message => "Missing 'name' parameter."}
      return 
    end

    name = params[:name].downcase.gsub(/\s+/, ' ').strip

    poets = Poet.where("lower(name) like ?", "%#{name}%")

    names = []
    poets.each do |poet|
      names << poet.name
    end

    if params.has_key?(:limit)
      limit = params[:limit].to_i

      limit = [limit, names.length].min
      if limit > 0
	names = names.in_groups_of(limit)[0]
      else
	names = []
      end
    end

    names = names.sort { |n1, n2| score_match(n1.downcase, name) <=> score_match(n2.downcase, name)} 

    render json: {:name => name ,:names  => names}

  end
  #------------------------------------------------------------------------------------#

  # Lower scores are better!
  def score_match(str, substr)

    score = 1/0.0

    if str == substr
      return 0
    end

    words = str.gsub(/s+/m, ' ').split(' ')

    words.each do |word|
      if substr == word
	score = substr.length
      end
    end

    score
  end

  #------------------------------------------------------------------------------------#

end
