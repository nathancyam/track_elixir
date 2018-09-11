defmodule TrackAppWeb.Router do
  use TrackAppWeb, :router

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

  scope "/", TrackAppWeb do
    pipe_through :browser # Use the default browser stack
  end

  # Other scopes may use custom stacks.
  scope "/api", TrackAppWeb do
    pipe_through :api
    post "/user", UserController, :create
    options "/user", UserController, :options
  end
end
