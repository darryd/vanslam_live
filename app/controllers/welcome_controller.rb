class WelcomeController < ApplicationController
  def index
  end

  def login
    flash[:session_id] = session[:session_id]

    flash[:is_logged_in] = is_logged_in() 

  end

  def is_logged_in
    0 != LoggedIn.where(session_id: session[:session_id]).count
  end
end
