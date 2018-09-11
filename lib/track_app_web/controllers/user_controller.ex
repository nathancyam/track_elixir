defmodule TrackAppWeb.UserController do
  use TrackAppWeb, :controller

  alias TrackAppWeb.UserUtil
  alias TrackApp.Sessions
  alias TrackApp.Data.User

  def create(conn, %{"name" => name}) do
    user = %User{id: UserUtil.generate_id(), name: name}
    {:ok, session_id, _} = Sessions.new_session(user)
    token = UserUtil.token(user)

    conn
    |> put_resp_header("Access-Control-Allow-Origin", "*")
    |> render("user.json", [token: token, session_id: session_id, user_id: user.id])
  end

  def options(conn, _params) do
    conn
    |> put_resp_header("Access-Control-Allow-Origin", "*")
    |> put_resp_header("Access-Control-Allow-Methods", "POST")
    |> put_resp_header("Access-Control-Allow-Headers", "Content-Type, Allow")
    |> send_resp(204, "")
  end
end
