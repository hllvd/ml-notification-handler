import { fetchMl } from "../fetcher-api.ml.service"

const getMe = async () => {
  const r = await fetchMl("/users/me")
  return r
}

export { getMe }
