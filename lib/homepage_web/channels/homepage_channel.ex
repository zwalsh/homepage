defmodule HomepageWeb.HomepageChannel do
  use HomepageWeb, :channel

  def join("homepage:"<>user_id, payload, socket) do
    if authorized?(payload) do
      send(self, :after_join)
      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (homepage:lobby).
  def handle_in("shout", payload, socket) do
    broadcast socket, "shout", payload
    {:noreply, socket}
  end

  def handle_info(:after_join, socket) do
    push(socket, "bg_img", %{url: Homepage.BackgroundImage.get_image_url()})
    push(socket, "quote", %{quote: Homepage.Quote.get_quote()})
    {:noreply, socket}
  end

  def handle_in("coords", payload, socket) do
    push(socket, "forecast", %{forecast: Homepage.Weather.get_forecast(payload["latitude"], payload["longitude"])})
    # push(socket, "predictions", %{predictions: Homepage.MBTA.get_next_trains(payload["latitude"], payload["longitude"])})
    {:reply, {:ok, payload}, socket}
  end

  def handle_in("spotify", payload, socket) do
    push(socket, "spotify", %{spotify: Homepage.Spotify.authorize()})
    {:reply, {:ok, payload}, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_) do
    true
  end
end
