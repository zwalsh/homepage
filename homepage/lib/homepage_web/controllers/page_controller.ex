defmodule HomepageWeb.PageController do
  use HomepageWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
