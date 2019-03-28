defmodule Homepage.MBTA do

#  Prediction: {
#     stop: Stop,
#     route: Route,
#     direction: Int,
#     arrival: UTC,
#     departure: UTC
# }

# Stop: {
#   id: String?,
#   name:  String,
# }

# Route: {
#   id: String,
#   direction_names: [String, ...],
#   direction_destinations: [String, ...]
#   color: String, - hex color,
#   description: String,
#   type: Int
# }
# r[longitude]=-71.1001725&filter[latitude]=42.3319226"
  # lat/long -> [Prediction, ...]
  def get_next_trains(latitude \\ "42.3319226", longitude \\ "-71.1001725") do
    {latitude, _} = Float.parse(latitude)
    {longitude, _} = Float.parse(longitude)
    preds = get_predictions(latitude, longitude)
    stops = get_stops(latitude, longitude)
    routes = get_routes()
    preds
    |> Enum.filter(&(routes[&1.route_id].description == "Rapid Transit"))
    |> Enum.map(&(Map.put(&1, :route, routes[&1.route_id])))
    |> Enum.map(&(Map.put(&1, :stop, stops[&1.stop_id])))
    |> bucket_preds  # bucket by stop, direction
    |> Enum.map(&(two_soonest(&1))) # take the next two arrivals at each stop/dir
    |> sort_closest(latitude, longitude) # sort the buckets by distance to stop
  end

  def two_soonest(preds) do
    Enum.sort(preds, &(first_time_sooner(&1.arrival, &2.arrival)))
    |> Enum.take(2)
  end

  def first_time_sooner(t1, t2) do
    DateTime.from_iso8601(t1) <= DateTime.from_iso8601(t2)
  end

  def bucket_preds(preds) do
    Enum.group_by(preds, &({&1.stop.id, &1.direction}), &(&1))
    |> Map.values()
  end

  def sort_closest(bucketed_preds, lat, lon) do
    Enum.sort(bucketed_preds, &(first_closer(hd(&1), hd(&2), lat, lon)))
  end

  def first_closer(p1, p2, lat, long) do
    distance_lat_long(p1.stop.latitude, p1.stop.longitude, lat, long) <=
      distance_lat_long(p2.stop.latitude, p2.stop.longitude, lat, long)
  end

  # from stackoverflow: calculate distance between two lat/long points,
  # user: Alexander Volkov, Salvador Dali
  # https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
  def distance_lat_long(lat1, lon1, lat2, lon2) do
    p = 0.017453292519943295 # Pi/180
    a = 0.5 - :math.cos((lat2 - lat1) * p)/2 + :math.cos(lat1 * p) * :math.cos(lat2 * p) * (1 - :math.cos((lon2 - lon1) * p)) / 2
    12742 * :math.asin(:math.sqrt(a))
  end

  def get_predictions(latitude, longitude) do
    url = "https://api-v3.mbta.com/predictions?filter[longitude]=#{longitude}&filter[latitude]=#{latitude}"
    {:ok, resp} = HTTPoison.get(url)
    data = Jason.decode!(resp.body)["data"]
    Enum.map(data, &(json_predict_to_predict(&1)))
  end

  def json_predict_to_predict(%{"attributes" => attrs, "relationships" => rels}) do
    %{
      arrival: attrs["arrival_time"],
      departure: attrs["departure_time"],
      direction: attrs["direction_id"],
      status: attrs["status"],
      stop_id: rels["stop"]["data"]["id"],
      route_id: rels["route"]["data"]["id"]
    }
  end


  def get_stops(latitude, longitude) do
    url = "https://api-v3.mbta.com/stops?filter[longitude]=#{longitude}&filter[latitude]=#{latitude}"
    {:ok, resp} = HTTPoison.get(url)
    data = Jason.decode!(resp.body)["data"]
    Enum.map(data, &(json_stop_to_stop(&1)))
    |> Enum.into(%{}, &({&1.id, &1}))
  end

  def json_stop_to_stop(%{"attributes" => attrs, "id" => id}) do
    %{
      id: id,
      name: attrs["name"],
      latitude: attrs["latitude"],
      longitude: attrs["longitude"]
    }
  end

  # Produces map of {Id -> Route} of all routes in the MBTA
  # todo - cache this in memory (for how long?)
  def get_routes() do
    url = "https://api-v3.mbta.com/routes"
    {:ok, resp} = HTTPoison.get(url)
    data = Jason.decode!(resp.body)["data"]
    Enum.map(data, &(json_route_to_route(&1)))
    |> Enum.into(%{}, &({&1.id, &1}))
  end

  def json_route_to_route(%{"attributes" => attrs, "id" => id}) do
    %{
      id: id,
      direction_names: attrs["direction_names"],
      direction_destinations: attrs["direction_destinations"],
      color: attrs["color"],
      description: attrs["description"],
      type: attrs["type"]
    }
  end

  def route_types() do
    Enum.into(get_routes(), MapSet.new(), &(&1.description))
  end

end
