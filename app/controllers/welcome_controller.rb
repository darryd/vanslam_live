class WelcomeController < ApplicationController

  #------------------------------------------------------------------------------------#
  def index
  end

  #------------------------------------------------------------------------------------#
  def login

    @is_logged_in = is_logged_in() != false


    result = is_logged_in()

    if result
      @user_name = result.scorekeeper.user_name
    end
    
  end

  #------------------------------------------------------------------------------------#
  def is_logged_in
    
    result = LoggedIn.where(session_id: session[:session_id])

    if result.count == 0
      return false

    else
      return result.take
    end

  end

  #------------------------------------------------------------------------------------#

  def check_credentials (user_name, password)

    scorekeeper = Scorekeeper.where(user_name: user_name).take

    if scorekeeper == nil
      result = false

    else 
      result = scorekeeper.authenticate(password)
    end

    return result
  end
  #------------------------------------------------------------------------------------#
  def do_log_in

    user_name = params[:user_name]
    password = params[:passwd]

    scorekeeper = check_credentials(user_name, password)

    if scorekeeper

      if not is_logged_in()

	logged_in = LoggedIn.new
	logged_in.scorekeeper_id = scorekeeper.id
	logged_in.session_id = session[:session_id]
	logged_in.save
      end

      result = true

    else
      result = false


      flash['message'] = "Error logging in."
    end

    redirect_to '/login'

  end
  #------------------------------------------------------------------------------------#

  def do_log_out

    logged_in = LoggedIn.where(session_id: session[:session_id]).take

    if logged_in != nil
      logged_in.delete
    end

    redirect_to '/login'

  end

  #------------------------------------------------------------------------------------#



end
