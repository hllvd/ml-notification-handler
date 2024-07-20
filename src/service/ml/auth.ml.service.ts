import { httpPost } from "../httpLayer/fetch-ml.httpLayer"
import "dotenv/config"
import { OAuthTokenResponse } from "../../models/authentication.model"
import {
  getAppConfigValue,
  setAppConfig,
} from "../../repository/app-config.repository"
import { payloadAuthToken, payloadRefreshToken } from "./constants/payloads"
import { searchParams } from "./constants/payloads"

const authUrl: string = "https://api.mercadolibre.com/oauth/token"
const authorizationBaseUrl = "https://auth.mercadolivre.com.br/authorization"

const authentication = async (code: string): Promise<OAuthTokenResponse> => {
  payloadAuthToken.code = code
  const { user_id, access_token, refresh_token } =
    await httpPost<OAuthTokenResponse>(authUrl, payloadAuthToken)
  _permanentSave({ user_id, access_token, refresh_token, refresh_token_ttl: 2 })
  return { user_id, access_token, refresh_token }
}

const reAuthentication = async (code: string): Promise<OAuthTokenResponse> => {
  payloadRefreshToken.refresh_token = code
  const { user_id, access_token, refresh_token } =
    await httpPost<OAuthTokenResponse>(authUrl, payloadRefreshToken)
  const refreshTokenTtl =
    (await getAppConfigValue({
      domain: user_id,
      key: "refresh_token_ttl",
    })) && 0
  const refresh_token_ttl = Number(refreshTokenTtl) - 1
  _permanentSave({ user_id, access_token, refresh_token, refresh_token_ttl })
  const domain = user_id.toString()

  return { user_id, access_token, refresh_token }
}

const loginUrl = () => {
  const url = new URL(authorizationBaseUrl)
  Object.entries(searchParams).forEach(([key, value]) => {
    console.log(key, value)
    url.searchParams.append(key, value)
  })
  return url
}

const _permanentSave = async ({
  user_id,
  access_token,
  refresh_token,
  refresh_token_ttl,
}: {
  user_id: string
  access_token: string
  refresh_token: string
  refresh_token_ttl: number
}) => {
  const domain = user_id.toString()
  await setAppConfig({
    domain,
    key: "access_token",
    value: access_token,
  })
  await setAppConfig({
    domain,
    key: "refresh_token",
    value: refresh_token,
  })
  await setAppConfig({
    domain,
    key: "refresh_token_ttl",
    value: refresh_token_ttl.toString(),
  })
}

export default { authentication, loginUrl, reAuthentication }
