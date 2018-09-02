defmodule TrackApp.Sessions do

  @session_supervisor TrackApp.SessionSupervisor

  alias TrackApp.Sessions.Session
  alias TrackApp.Data.{PointOfInterest, User}

  def new_session(%User{id: nil}) do
    {:error, "User needs to have an ID"}
  end

  def new_session(%User{id: _id} = initial_user) do
    id = UUID.uuid4()
    {:ok, pid} = DynamicSupervisor.start_child(@session_supervisor, Session.child_spec([initial_user, id]))
    {:ok, id, pid}
  end

  def add_user_to_session(session_id, %User{id: nil} = user) do
    Session.join(session_id, user)
  end

  def add_user_to_session(session_id, %User{id: _id} = user) do
    Session.join(session_id, user)
  end

  def add_point_of_interest(session_id, %PointOfInterest{} = point) do
    Session.add_point_of_interest(session_id, point)
  end
end
