class WelcomeController < ApplicationController
  def index
  end

  def login
    flash[:session_id] = session[:session_id]
  end
end
