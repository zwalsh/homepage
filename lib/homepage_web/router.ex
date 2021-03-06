defmodule HomepageWeb.Router do
  use HomepageWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", HomepageWeb do
    pipe_through :browser

    get "/", PageController, :index
    get "/authorize", OAuthController, :authorize
    get "/callback", OAuthController, :callback
    get "/register", PageController, :index
  end

  # Other scopes may use custom stacks.
  scope "/api", HomepageWeb do
    pipe_through :api

    resources "/users", UserController, except: [:new, :edit]
    post "/authorize", AuthController, :authorize
    get "/tracks", SpotifyController, :track
  end
end
