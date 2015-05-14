class CompetitionController < ApplicationController

  def show
    begin
      @slam = Competition.find(params[:id])
    rescue
      redirect_to '/'
    end
  end

  def new_performance

    begin
      round = Round.find(params[:round_id])
    rescue
      render json: {:result => false, :message => "No round found"}
      return
    end

    poet = Poet.where(name: params[:name]).first  

    if poet == nil
      render json: {:result => false, :message => "No poet found"}
      return
    end

    render json: {:result  => true, :poet => poet}    

  end

end

