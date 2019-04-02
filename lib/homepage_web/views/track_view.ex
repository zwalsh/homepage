defmodule HomepageWeb.TrackView do
  use HomepageWeb, :view
  alias HomepageWeb.TrackView

  def render("index.json", %{tracks: tracks}) do
    %{data: render_many(tracks, TrackView, "track.json")}
  end

  def render("show.json", %{track: track}) do
    %{data: render_one(track, TrackView, "track.json")}
  end

  def render("track.json", %{track: track}) do
    %{id: track.id,
      spotify_id: track.spotify_id,
      title: track.title,
      artist: track.artist}
  end
end
