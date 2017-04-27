
#require './app/middleware/chat_backend'
require File.expand_path('../../../app/middleware/chat_backend', __FILE__)

class WelcomeController < ApplicationController

  #------------------------------------------------------------------------------------#
  def index

    host = Host.where(host: request.host).take
    @title = host.organization.title
	@is_using_seasons = host.organization.is_using_seasons

    @templates = host.organization.competitions.order('created_at DESC').where(is_template: true)
	@seasons = host.organization.seasons
    @slams = host.organization.competitions.order('created_at DESC').where(is_template: [nil, false])
  end

  #------------------------------------------------------------------------------------#
  def competitions_json

    host = Host.where(host: request.host).take
    title = host.organization.title
    slams = host.organization.competitions.order('created_at DESC').where(is_template: [nil, false])


    render json: {:title => title, :slams => slams}
  end
  #------------------------------------------------------------------------------------#

  def events

    host = Host.where(host: request.host).take
    @title = host.organization.title

    @slams = host.organization.competitions.order('created_at DESC')
  end

  #------------------------------------------------------------------------------------#
  def login

    @page = params[:page]
    @is_logged_in = is_logged_in() != false


    result = is_logged_in()

    if result
      @user_name = result.scorekeeper.user_name
    end
    
  end
  #------------------------------------------------------------------------------------#
  def check_login 
    render json: get_login_info()
  end
  #------------------------------------------------------------------------------------#

  def check_credentials (user_name, password)

    scorekeeper = Scorekeeper.where('lower(user_name) = ?', user_name.downcase).take

    if scorekeeper == nil
      result = false

    else 
      result = scorekeeper.authenticate(password)
    end

    return result
  end
  #------------------------------------------------------------------------------------#
  def do_log_in

    user_name = params[:user_name].gsub(/\s+/, " ").strip
    password = params[:passwd]

    scorekeeper = check_credentials(user_name, password)

    if scorekeeper

      if not is_logged_in()

	logged_in = LoggedIn.new
	logged_in.scorekeeper_id = scorekeeper.id
	logged_in.session_id = session[:session_id]
	logged_in.key = [*('a'..'z'),*('0'..'9')].shuffle[0,20].join
	logged_in.save
      end

      result = true

    else
      result = false


      flash['message'] = "Error logging in. Incorrect username and/or password."
    end

    if result
      redirect_to params[:page]
    else
      redirect_to '/login'
    end

  end
  #------------------------------------------------------------------------------------#

  def do_log_out

    logged_in = LoggedIn.where(session_id: session[:session_id]).take

    if logged_in != nil
      logged_in.delete
    end
    
    render json: {:result => true}

  end

  #------------------------------------------------------------------------------------#



end
