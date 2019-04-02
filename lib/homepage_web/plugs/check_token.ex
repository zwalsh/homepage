defmodule HomepageWeb.Plugs.CheckToken do
  use HomepageWeb, :controller

  def init(args), do: args

  def call(conn, params) do
    IO.puts("checking token")
    IO.inspect(params)
    conn
    # case Phoenix.Token.verify(HomepageWeb.Endpoint, "user_id", token, max_age: 86400) do
    #   {:ok, id} -> conn
    #                 |> assign(:user_id, id)
    #   {:error, _} -> conn
    #                   |> halt
    # end
  end
end
