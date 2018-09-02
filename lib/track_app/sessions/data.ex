defmodule TrackApp.Data do

  defmodule PointOfInterest do
    defstruct [:name, :longitude, :latitude, :notes, :user]
  end

  defmodule User do
    defstruct [:id, :name]
  end

end
