defmodule HomepageWeb.SpotifyController do
  use HomepageWeb, :controller

  def track(conn, _params) do
    ids = top_5_ids(conn)
    seed_tracks = Enum.join(ids, ",")
    {:ok, rec} = Spotify.Recommendation.get_recommendations(conn, seed_tracks: seed_tracks)
    IO.inspect(rec.tracks)
    conn
    |> json(%{rec: rec.tracks})
  end

  def top_5_ids(conn) do
    {:ok, paging} = Spotify.Personalization.top_tracks(conn, time_range: "short_term")
    tracks = paging.items
    Enum.take(tracks, 5)
    |> Enum.map(&(&1.id))
  end
end

require Protocol
Protocol.derive(Jason.Encoder, Spotify.Track, except: [:available_markets])
Protocol.derive(Jason.Encoder, Spotify.Recommendation)
