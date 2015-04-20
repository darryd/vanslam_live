class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception


  #------------------------------------------------------------------------------------#
  def get_login_info

    result  = is_logged_in()
    if result
      info = { :is_logged_in => true, :user => result.scorekeeper.user_name }
    else
      info = { :is_logged_in => false }
    end

    info
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

end
