defmodule Homepage.Users.User do
  use Ecto.Schema
  import Ecto.Changeset

  schema "users" do
    field :email, :string
    field :first, :string
    field :last, :string
    field :password_hash, :string
    has_many :tracks, Homepage.Tracks.Track

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:first, :last, :email, :password_hash])
    |> validate_required([:first, :last, :email, :password_hash])
  end
end
