import {
  ML_REDIRECT_URI,
  ML_CLIENT_ID,
  ML_CLIENT_SECRET,
} from "../../../constants"
const payloadCommon = {
  client_id: ML_CLIENT_ID,
  client_secret: ML_CLIENT_SECRET,
}
const payloadAuthToken = {
  grant_type: "authorization_code",
  ...payloadCommon,
  code: "",
  redirect_uri: ML_REDIRECT_URI,
}

const payloadRefreshToken = {
  grant_type: "refresh_token",
  ...payloadCommon,
  refresh_token: "",
}

const searchParams = {
  response_type: "code",
  client_id: ML_CLIENT_ID,
  redirect_uri: ML_REDIRECT_URI,
}

export { payloadCommon, payloadAuthToken, payloadRefreshToken, searchParams }
