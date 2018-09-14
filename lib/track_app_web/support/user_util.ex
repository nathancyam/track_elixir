defmodule TrackAppWeb.UserUtil do
  @endpoint TrackAppWeb.Endpoint
  @salt "user_id"

  def generate_id() do
    UUID.uuid4()
  end

  def token(%TrackApp.Data.User{id: id}) do
    Phoenix.Token.sign(@endpoint, @salt, id)
  end

  def verify(token) do
    Phoenix.Token.verify(@endpoint, @salt, token, max_age: 86400)
  end

end
