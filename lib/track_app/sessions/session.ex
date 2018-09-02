defmodule TrackApp.Sessions.Session do

  use GenServer

  alias TrackApp.Data.{PointOfInterest, User}
  alias :mnesia, as: Mnesia

  defmodule State do
    defstruct [:id, :users, :points_of_interest]
  end

  def start_link([%User{} = user, uuid]) do
    GenServer.start_link(__MODULE__, [user, uuid], name: via_tuple(uuid))
  end

  def init([%User{} = user, uuid]) do
    {:ok, %State{id: uuid, users: [user], points_of_interest: []}}
  end

  def join(session_id, %User{id: id, name: name} = user) do
    result = GenServer.call(via_tuple(session_id), {:user_add, user})
    Mnesia.transaction(fn ->
      Mnesia.write({User, id, name})
    end)
  end

  def add_point_of_interest(session_id, %PointOfInterest{} = point) do
    GenServer.call(via_tuple(session_id), {:poi_add, point})
  end

  def handle_call({:user_add, %User{} = user}, _from, %State{users: current_users} = state) do
    {:reply, user, %{state | users: current_users ++ user}}
  end

  def handle_call({:poi_add, %PointOfInterest{} = point}, _from, %State{points_of_interest: points} = state) do
    new_points = points ++ point
    {:reply, new_points, %{state | points_of_interest: new_points}}
  end

  defp via_tuple(uuid) do
    {:via, Registry, {TrackApp.SessionRegistry, uuid}}
  end

end
