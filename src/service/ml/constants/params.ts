import { ML_REDIRECT_URI, ML_CLIENT_ID } from "../../../constants"

const searchParams = {
  response_type: "code",
  client_id: ML_CLIENT_ID,
  redirect_uri: ML_REDIRECT_URI,
}

export { searchParams }
