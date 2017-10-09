Rails.application.routes.draw do

  get 'welcome/events'

  get 'welcome/index'
  get 'welcome/login'
  root :to => "welcome#index"


  get 'welcome/competitions_json'

  get "/login", to: "welcome#login"

  post "welcome/do_log_in"
  get "welcome/do_log_out"
  post "welcome/do_log_out"

  get "welcome/check_login"
  post "welcome/check_login"
  

  get "poet/names"
  
  post "poet/post_create_or_get"
  post "poet/post_suggestions"
#  get "poet/post_suggestions"

  get "poet/lookup"

  post "competition/signup_poet"
  get "competition/signup_poet"

  post "competition/remove_performance"
  #get "competition/remove_performance"

  #get "welcome/chat"

  get "competition/show"

  post "competition/new_performance"
  #get "competition/new_performance"

  post "competition/echo"

  #get "competition/judge"
  post "competition/judge"

  #get "competition/get_current_event_number"
  post "competition/get_current_event_number"

  #get "competition/get_event"
  post "competition/get_event"

  #get "competition/set_time"
  post "competition/set_time"
  
  #get "competition/set_penalty"
  post "competition/set_penalty"

  #get "competition/get_event_range"
  post "competition/get_event_range"


  get "competition/what_did_i_miss"
  post "competition/what_did_i_miss"
  

  get "competition/new_round"
  post "competition/new_round"

  get "competition/browsers_reload"
  post "competition/browsers_reload"
  

  get "competition/clone_slam"
  post "competition/clone_slam"

  get "competition/announcement"
  post "competition/announcement"

  get "competition/edit_round"
  post "competition/edit_round"

  post "competition/change_name"
  post "competition/insert_before"

  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
