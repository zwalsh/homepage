defmodule HomepageWeb.SpotifyController do
  use HomepageWeb, :controller

  plug HomepageWeb.Plugs.CheckToken when action in [:track]

  alias Homepage.Tracks.Track
  alias Homepage.Repo
  alias HomepageWeb.TrackView

  def track(conn, params) do

    user_id = params["session"]["user_id"]
    options = params["options"]
    tracks = Map.values(params["seeds"])

    ids = tracks
    |> Enum.map(&(&1["spotify_id"]))

    seed_tracks = Enum.join(ids, ",")
    rec = get_recs(conn, options, seed_tracks)

    conn
    |> json(%{rec: hd(rec.tracks)})
  end


  def top_5_tracks(conn, params) do

    user_id = params["session"]["user_id"]

    db_tracks = Homepage.Tracks.list_tracks_by_user(user_id)
    db_available_tracks = Enum.filter(db_tracks, &(!&1.soft_deleted))

    if length(db_available_tracks) >= 5 do
      seeds = Enum.take(db_available_tracks, 5)

      %{data: json_seeds} = TrackView.render("index.json", %{tracks: seeds})

      conn
      |> json(%{seeds: json_seeds})

    else
      {conn, seeds} = fetch_and_store(conn, user_id, 5 - length(db_available_tracks), db_tracks)

      %{data: json_seeds} = TrackView.render("index.json", %{tracks: seeds})

      conn
      |> json(%{seeds: json_seeds})

    end
  end

  def fetch_and_store(conn, user_id, num_tracks, db_tracks) do
    with {:ok, _paging = %Paging{items: items}} <- Spotify.Personalization.top_tracks(conn, time_range: "short_term") do

      tracks = items
      |> Enum.map(&(spotify_track_to_track(&1, user_id)))
      |> Enum.filter(fn s_track -> !Enum.any?(db_tracks, &(&1.spotify_id == s_track.spotify_id)) end)
      |> Enum.take(num_tracks)
      
      Enum.each(tracks, &(Repo.insert(&1)))

      tracks = Enum.take(Homepage.Tracks.list_available_tracks(user_id), 5)

      {conn, tracks}
    else
      {:ok, _error} -> conn = HomepageWeb.OAuthController.refresh(conn)
      fetch_and_store(conn, user_id, num_tracks, db_tracks)
    end
  end

  def get_recs(conn, nil, seeds) do
     get_recs(conn, %{
       "danceability" => "",
       "acousticness" => "",
       "energy" => "",
       "popularity" => "",
       }, seeds)
  end

  def get_recs(conn, options = %{
    "danceability" => danceability,
    "acousticness" => acousticness,
    "energy" => energy,
    "popularity" => popularity,
    }, seeds) do

    resp = Spotify.Recommendation.get_recommendations(
      conn,
      seed_tracks: seeds,
      target_danceability: danceability,
      target_acousticness: acousticness,
      target_energy: energy,
      target_popularity: popularity
    )

    with {:ok, rec = %Spotify.Recommendation{}} <- resp do
      rec
    else
      {:ok, %{"error" => %{"message" => "The access token expired"}}} ->
        conn = HomepageWeb.OAuthController.refresh(conn)
        get_recs(conn, options, seeds)
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
end

require Protocol
Protocol.derive(Jason.Encoder, Spotify.Track, except: [:available_markets])
Protocol.derive(Jason.Encoder, Spotify.Recommendation)
