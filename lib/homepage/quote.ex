defmodule Homepage.Quote do

  def get_quote() do
    resp = HTTPoison.get!("https://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en")
    data = Jason.decode!(resp.body)
    data
  end
end
