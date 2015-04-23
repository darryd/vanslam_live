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

    poets = Poet.where("lower(name) like ?", "%#{name}%").order(:name)
    names = []
    poets.each do |poet|

      if poet.name.downcase.match('\b' + name)
	names << poet.name
      end
    end

    if params.has_key?(:limit) and names.length > 0
      limit = params[:limit].to_i
      limit = [limit, names.length].min
      if limit > 0
	names = names.in_groups_of(limit)[0]
      else
	names = []
      end
    end

    render json: {:result => true ,:names  => names}

  end
  #------------------------------------------------------------------------------------#

  # Lower scores are better!
  def score_match(str, substr)

    score = str.length

    words = str.gsub(/s+/m, ' ').split(' ')

    words.each do |word|
      if substr == word
	score = word.length
	break
      end
    end

    if str == substr
      score = 0
    end

    score
  end

  #------------------------------------------------------------------------------------#

  def lookup
  end

  #------------------------------------------------------------------------------------#
end
