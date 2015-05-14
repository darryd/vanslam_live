require File.expand_path('../../../app/middleware/chat_backend', __FILE__)

class CompetitionController < ApplicationController

  def show
    begin
      @slam = Competition.find(params[:id])
    rescue
      redirect_to '/'
    end
  end

  def new_performance

    if not is_logged_in()
      render json: {:result => false, :message => "You must be logged in to do that."}
      return
    end

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

    performance = Performance.new(round_id: round.id, poet_id: poet.id)
    performance.save

    render json: {:result  => true, :performance_id => performance.id}    
    ChatDemo::ChatBackend.hello({:event => "new_peformance", :performance_id => performance.id, :poet_name => poet.name, :round_number => round.round_number})

  end

end

