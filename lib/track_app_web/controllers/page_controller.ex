defmodule TrackAppWeb.PageController do
  use TrackAppWeb, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
