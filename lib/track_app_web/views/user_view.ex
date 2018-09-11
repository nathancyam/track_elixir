defmodule TrackAppWeb.UserView do
  use TrackAppWeb, :view

  def render("user.json", %{token: token, session_id: session_id, user_id: user_id}) do
    %{token: token, session_id: session_id, user_id: user_id}
  end
end
