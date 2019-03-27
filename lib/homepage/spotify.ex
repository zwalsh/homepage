defmodule Homepage.Spotify do

  def authorize() do
    # TODO include state param?
    # https://developer.spotify.com/documentation/general/guides/authorization-guide/#authorization-code-flow
    resp = HTTPoison.get!("https://accounts.spotify.com/authorize?client_id=2a95c7d209db4cc9b1931e42bca04961&response_type=code")
    # data = Jason.decode!(resp.body)

    # IO.inspect(resp)

    # data
    nil
  end
end
