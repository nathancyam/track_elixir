defmodule TrackAppWeb.RoomChannel do
  use Phoenix.Channel

  alias TrackAppWeb.Endpoint
  alias TrackApp.Data.{PointOfInterest, User}
  alias TrackApp.Sessions

  def join("room:lobby", _message, socket) do
    {:ok, socket}
  end

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
    "room:" <> session_id = socket.topic
    point = %PointOfInterest{
      name: "",
      longitude: long,
      latitude: lat,
      notes: "",
      user: socket.assigns[:user_id]
    }

    Sessions.add_point_of_interest(session_id, point)
    {:noreply, socket}
  end

  def handle_in("sync", _body, socket) do
    "room:" <> session_id = socket.topic
    {:reply, {:ok, Sessions.state(session_id)}, socket}
  end

end
