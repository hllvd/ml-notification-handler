import { ConfigurationOptions } from "aws-sdk"
import { fetchMl } from "../fetcher-api.ml.service"

const getMe = async (userId) => {
  const options = {
    userId,
    method: "GET",
  }
  const r = await fetchMl("/users/me", options)
  console.log(r)
  return r
}

export { getMe }
