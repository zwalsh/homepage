defmodule Homepage.Repo.Migrations.CreateTracks do
  use Ecto.Migration

  def change do
    create table(:tracks) do
      add :spotify_id, :string, null: false
      add :title, :string
      add :artist, :string
      add :soft_deleted, :boolean, default: false
      add :user_id, references(:users, on_delete: :delete_all), null: false

      timestamps()
    end

    create index(:tracks, [:spotify_id, :user_id], unique: true)
  end
end
