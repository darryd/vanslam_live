require File.expand_path('../../../app/middleware/chat_backend', __FILE__)

class CompetitionController < ApplicationController

  #-----------------------------------------------------------------------------------------#
  # Displays the competition

  def show
    begin
      @slam = Competition.find(params[:id])
    rescue
      redirect_to '/'
    end
  end

  #-----------------------------------------------------------------------------------------#
  def echo
    render json: {:sentence => params[:sentence], :reverse => params[:sentence].reverse};
  end

  #-----------------------------------------------------------------------------------------#
  # Creates a new performance
  #
  # Params: round_id, name
 
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
  #-----------------------------------------------------------------------------------------#

  # performance_id, judge_name

  def judge
    if not_allowed()
      return
    end

    if missing_params(params, ['performance_id', 'judge_name', 'value'])
      return
    end

    begin
      performance = Performance.find(params[:performance_id])
    rescue
      render json: {:result => false, :message => "Could not find performance."}
      return
    end

    judge_name = params[:judge_name]
    judge = performance.judges.where(judge_name: judge_name).first_or_create(:judge_name=>judge_name) 

    judge.value = params[:value].to_f
    judge.save


    ChatDemo::ChatBackend.hello(:event => "judge", :judge_name => judge_name, :value => judge.value) 

    render json: {:result => true, :judge => judge}
  end
  #-----------------------------------------------------------------------------------------#


end

