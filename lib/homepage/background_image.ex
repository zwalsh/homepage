defmodule Homepage.BackgroundImage do

  def get_image_url() do
    resp = HTTPoison.get!("https://www.reddit.com/r/earthporn.json")
    data = Jason.decode!(resp.body)

    posts = data["data"]["children"]

    post = Enum.find(posts, &(post_aspect_ratio(&1)))
    post["data"]["url"]
  end

  def post_aspect_ratio(post) do
    source =  hd(post["data"]["preview"]["images"])["source"]
    width = source["width"]
    height = source["height"]

    ratio = width / height
    (ratio > 1.5) && (ratio < 2.0)
  end
end
