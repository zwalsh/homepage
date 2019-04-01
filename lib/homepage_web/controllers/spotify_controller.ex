defmodule HomepageWeb.SpotifyController do
  use HomepageWeb, :controller

  def track(conn, _params) do
    tracks = top_5_tracks(conn)

    ids = tracks
    |> Enum.map(&(&1.id))

    seed_tracks = Enum.join(ids, ",")
    {:ok, rec} = Spotify.Recommendation.get_recommendations(conn, seed_tracks: seed_tracks)
    conn
    |> json(%{rec: hd(rec.tracks), tracks: tracks})
  end

  def top_5_tracks(conn) do
    {:ok, paging} = Spotify.Personalization.top_tracks(conn, time_range: "short_term")
    tracks = paging.items

    Enum.take(tracks, 5)
  end
end

require Protocol
Protocol.derive(Jason.Encoder, Spotify.Track, except: [:available_markets])
Protocol.derive(Jason.Encoder, Spotify.Recommendation)
