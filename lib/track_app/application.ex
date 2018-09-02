defmodule TrackApp.Application do
  use Application
  require Logger

  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  def start(_type, _args) do
    import Supervisor.Spec

    # Define workers and child supervisors to be supervised
    children = [
      # Start the endpoint when the application starts
      supervisor(TrackAppWeb.Endpoint, []),
      # Start your own worker by calling: TrackApp.Worker.start_link(arg1, arg2, arg3)
      # worker(TrackApp.Worker, [arg1, arg2, arg3]),
      supervisor(
        Registry,
        [[keys: :unique, name: TrackApp.SessionRegistry]]
      ),
      supervisor(
        DynamicSupervisor,
        [[name: TrackApp.SessionSupervisor, strategy: :one_for_one]]
      )
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: TrackApp.Supervisor]
    create_db()

    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    TrackAppWeb.Endpoint.config_change(changed, removed)
    :ok
  end

  defp create_db() do
    alias :mnesia, as: Mnesia
    Mnesia.create_schema([node()])
    Mnesia.start()

    case Mnesia.create_table(User, [attributes: [:id, :name]]) do
      {:atomic, :ok} ->
        Logger.info("User table created")
      {:aborted, _reason} ->
        Logger.info("User table already created")
    end
  end
end
