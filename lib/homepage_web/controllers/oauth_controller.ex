defmodule HomepageWeb.OAuthController do
   use HomepageWeb, :controller

   def authorize(conn, _params) do
     redirect conn, external: Spotify.Authorization.url
   end

   def callback(conn, %{"code" => code}) do
     {:ok, conn} = Spotify.Authentication.authenticate(conn, %{"code" => code})
     conn
     |> redirect(to: "/")
   end
 end
