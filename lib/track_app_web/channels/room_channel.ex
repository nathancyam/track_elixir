defmodule TrackAppWeb.RoomChannel do
  use Phoenix.Channel

  alias TrackApp.Data.User
  alias TrackApp.Sessions

  def join("room:lobby", _message, socket) do
    {:ok, socket}
  end

  def handle_in("new_user", %{"user" => %{"name" => name}}, socket) do
    user = %User{id: UUID.uuid4(), name: name}
    {:ok, session_id, _} = Sessions.new_session(user)
    {:reply, {:ok, %{"user" => user, "session_id" => session_id}}, socket}
  end
end
