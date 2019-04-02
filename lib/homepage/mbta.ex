defmodule Homepage.MBTA do

  def mbta_key() do
    Application.get_env(:homepage, Homepage.MBTA)[:api_key]
  end


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
    |> first_per_route([])
    |> Enum.map(&(format_resps(&1)))
  end

  def first_per_route([], _routes_included), do: []

  def first_per_route([p1 | predictions], routes_included) do
    cur_route = hd(p1).route.id
    cur_stop = hd(p1).stop.name
    cur_pair = {cur_route, cur_stop}
    if !Enum.member?(routes_included, cur_pair)
        and Enum.any?(routes_included, fn {route, _stop} -> route == cur_route end) do
      first_per_route(predictions, routes_included)
    else
      [p1 | first_per_route(predictions, [cur_pair | routes_included])]
    end
  end

  def two_soonest(preds) do
    Enum.sort(preds, &(first_time_sooner(&1.arrival, &2.arrival)))
    |> Enum.take(2)
  end

  def format_resps(predictions) do
    predictions
    |> Enum.map(&(format_resp(&1)))
  end

  def format_resp(prediction) do
    direction = prediction.direction
    direction_destinations = prediction.route.direction_destinations
    direction_names = prediction.route.direction_names
    now = DateTime.utc_now()
    {:ok, arrival, _} = DateTime.from_iso8601(prediction.arrival)
    diff = DateTime.diff(arrival, now) / 60
    %{
      arrival: prediction.arrival,
      departure: prediction.departure,
      min_to_arrival: diff,
      dest: Enum.fetch!(direction_destinations, direction),
      dir: Enum.fetch!(direction_names, direction),
      color: prediction.route.color,
      stop: prediction.stop.name,
      status: prediction.status,
      route: prediction.route.id,
    }
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
    {:ok, resp} = mbta_request(url)
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
    {:ok, resp} = mbta_request(url)
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
    {:ok, resp} = mbta_request(url)
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

  def mbta_request(url) do
    HTTPoison.get(url, [{"x-api-key", mbta_key()}])
  end

end
