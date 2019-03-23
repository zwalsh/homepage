defmodule HomepageWeb.AuthController do
  use HomepageWeb, :controller

  alias Homepage.Users
  alias Homepage.Users.User

  action_fallback HomepageWeb.FallbackController

  def authorize(conn, %{"email" => email, "password" => password}) do
    with user <- Users.get_user_by_email(email),
          {:ok, user} <- Argon2.check_pass(user, password) do
      conn
      |> json(%{
        "data" => %{
          "token" => Phoenix.Token.sign(HomepageWeb.Endpoint, "user_id", user.id),
          "user_id" => user.id,
          "email" => user.email
        }
      })
    end
  end
end
