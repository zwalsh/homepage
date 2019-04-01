defmodule Homepage.Weather do

  def get_forecast(latitude, longitude) do

    config = Application.get_env(:homepage, Homepage.Weather)

    resp = HTTPoison.get!("http://api.apixu.com/v1/forecast.json?key=" <> config[:api_key] <> "&q=" <> latitude <> "," <> longitude)
    data = Jason.decode!(resp.body)

    data
  end
end
