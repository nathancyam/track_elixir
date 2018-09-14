defmodule TrackAppWeb.UserController do
  use TrackAppWeb, :controller

  require Logger
  alias :mnesia, as: Mnesia
  alias TrackAppWeb.UserUtil
  alias TrackApp.Sessions
  alias TrackApp.Data.User, as: DataUser

  def create(conn, %{"name" => name}) do
    user = %DataUser{id: UserUtil.generate_id(), name: name}
    {:ok, session_id, _} = Sessions.new_session(user)
    token = UserUtil.token(user)

    case Mnesia.transaction(fn -> Mnesia.write({User, user.id, name}) end) do
      {:atomic, :ok} ->
        Logger.info("Created user in DB")
      err ->
        IO.inspect(err)
        Logger.warn("Failed to create user in DB")
    end

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

  def list(conn, _params) do
    txn = fn -> :mnesia.foldl(fn (val, acc) -> acc ++ [val] end, [], User) end
    handle_query(Mnesia.transaction(txn), conn)
  end

  defp handle_query({:atomic, users}, conn) when is_list(users) do
    json(conn, %{users: Enum.map(users, fn {_, id, name} -> %{id: id, name: name} end)})
  end

  defp handle_query(_, conn) do
    json(conn, %{users: []})
  end
end
