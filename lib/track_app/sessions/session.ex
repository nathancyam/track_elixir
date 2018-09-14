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

  def ping(session_id) do
    case GenServer.call(via_tuple(session_id), :ping) do
      :ok -> {:ok, "session #{session_id} exists"}
      _ -> {:error, "session #{session_id} does not exist"}
    end
  end

  def join(session_id, %User{id: id, name: name} = user) do
    result = GenServer.call(via_tuple(session_id), {:user_add, user})
    Mnesia.transaction(fn ->
      Mnesia.write({User, id, name})
    end)
  end

  def add_point_of_interest(session_id, %PointOfInterest{} = point) do
    GenServer.cast(via_tuple(session_id), {:poi_add, point})
  end

  def state(session_id) do
    GenServer.call(via_tuple(session_id), :state)
  end

  def handle_call(:state, _from, state) do
    {:reply, state, state}
  end

  def handle_call(:ping, _from, state) do
    {:reply, :ok, state}
  end

  def handle_call({:user_add, %User{} = user}, _from, %State{users: current_users} = state) do
    {:reply, user, %{state | users: current_users ++ user}}
  end

  def handle_cast({:poi_add, %PointOfInterest{} = point}, %State{points_of_interest: points} = state) do
    new_points = points ++ [point]
    {:noreply, %{state | points_of_interest: new_points}}
  end

  defp via_tuple(uuid) do
    {:via, Registry, {TrackApp.SessionRegistry, uuid}}
  end

end
