defmodule Homepage.Weather do

  def get_forecast(latitude, longitude) do
    resp = HTTPoison.get!("http://api.apixu.com/v1/forecast.json?key=7381ae30f357451ca9c165430192703&q=" <> latitude <> "," <> longitude)
    data = Jason.decode!(resp.body)

    data
  end
end
