# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     Homepage.Repo.insert!(%Homepage.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

alias Homepage.Repo
alias Homepage.Users.User

pass = Argon2.hash_pwd_salt("password")

Repo.insert!(%User{first: "Avery", last: "Peterson", email: "avery@example.com",
password_hash: pass})

Repo.insert!(%User{first: "Zach", last: "Walsh", email: "zach@example.com",
password_hash: pass})
