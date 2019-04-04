defmodule Homepage.Tracks.Track do
  use Ecto.Schema
  import Ecto.Changeset

  schema "tracks" do
    field :artist, :string
    field :spotify_id, :string
    field :title, :string
    field :soft_deleted, :boolean
    belongs_to :user, Homepage.Users.User

    timestamps()
  end

  @doc false
  def changeset(track, attrs) do
    track
    |> cast(attrs, [:spotify_id, :title, :artist, :soft_deleted, :user_id])
    |> validate_required([:spotify_id, :title, :artist, :user_id])
  end
end
