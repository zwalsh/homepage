# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :homepage,
  ecto_repos: [Homepage.Repo]

# Configures the endpoint
config :homepage, HomepageWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "nqgiKNq1rcTYW19JwoaDBs1Hf1JBC/LeiCgondLGh+vNfrjzZh7zmNmPU1uGEKQV",
  render_errors: [view: HomepageWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Homepage.PubSub, adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"

import_config "secret.exs"
import_config "spotify.exs"
