defmodule HomepageWeb.SpotifyController do
  use HomepageWeb, :controller

  plug HomepageWeb.Plugs.CheckToken when action in [:track]

  alias Homepage.Tracks.Track
  alias Homepage.Repo
  alias HomepageWeb.TrackView

  def track(conn, params) do
    user_id = params["session"]["user_id"]
    danceability = params["sliderVal"]

    IO.inspect(params)

    unless Spotify.Authentication.tokens_present?(conn) do
      conn
    end

    {conn, tracks} = top_5_tracks(conn, user_id)
    IO.inspect(tracks)
    ids = tracks
    |> Enum.map(&(&1.spotify_id))

    seed_tracks = Enum.join(ids, ",")
    IO.inspect(Spotify.Recommendation.get_recommendations_url(seed_tracks: seed_tracks, danceability: danceability))
    {:ok, rec} = Spotify.Recommendation.get_recommendations(conn, seed_tracks: seed_tracks, danceability: danceability)
    %{data: json_tracks} = TrackView.render("index.json", %{tracks: tracks})
    conn
    |> json(%{rec: hd(rec.tracks), tracks: json_tracks})
  end


  def top_5_tracks(conn, user_id) do
    db_tracks = Homepage.Tracks.list_tracks_by_user(user_id)
    if length(db_tracks) >= 5 do
      IO.puts("All from db")
      {conn, Enum.take(db_tracks, 5)}
    else
      {conn, spotify_tracks} = fetch_and_store(conn, user_id, 5 - length(db_tracks))
      {conn, db_tracks ++ spotify_tracks}
    end
  end

  def fetch_and_store(conn, user_id, num_tracks) do
    with {:ok, _paging = %Paging{items: items}} <- Spotify.Personalization.top_tracks(conn, time_range: "short_term") do
      tracks = Enum.take(items, num_tracks)
                |> Enum.map(&(spotify_track_to_track(&1, user_id)))
      Enum.each(tracks, &(Repo.insert(&1)))
      {conn, tracks}
    else
      {:ok, _error} -> conn = HomepageWeb.OAuthController.refresh(conn)
      fetch_and_store(conn, user_id, num_tracks)
    end
  end

  def spotify_track_to_track(st, user_id) do
    %Track{
      user_id: String.to_integer(user_id),
      spotify_id: st.id,
      title: st.name,
      artist: hd(st.artists)["name"]
    }
  end


#  check db for tracks:
# if 5, return those
# if less than 5, fetch and store up to 5 in our db
# return 5 now in db in our track form
end

require Protocol
Protocol.derive(Jason.Encoder, Spotify.Track, except: [:available_markets])
Protocol.derive(Jason.Encoder, Spotify.Recommendation)
