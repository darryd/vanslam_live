class CompetitionController < ApplicationController

  def show
    begin
      @slam = Competition.find(params[:id])
    rescue
      redirect_to '/'
    end
  end

end
