defmodule TrackAppWeb.RoomChannel do
  use Phoenix.Channel

  alias TrackApp.Data.User
  alias TrackApp.Sessions

  def join("room:" <> session_id, _message, socket) do
    case Sessions.ping(session_id) do
      {:ok, _msg} -> {:ok, socket}
      {:error, msg} -> {:error, %{message: msg}}
    end
  end

  def handle_in("new_user", %{"user" => %{"name" => name}}, socket) do
    user = %User{id: UUID.uuid4(), name: name}
    {:ok, session_id, _} = Sessions.new_session(user)
    {:reply, {:ok, %{"user" => user, "session_id" => session_id}}, assign(socket, :user_id, user.id)}
  end

  def handle_in("new_coordinates", %{"lat" => lat, "lng" => long} = coordinates, socket) do
    broadcast!(socket, "new_entry", coordinates)
    {:noreply, socket}
  end
end
