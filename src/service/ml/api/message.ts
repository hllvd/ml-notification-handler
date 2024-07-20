import { FetchMlOptionsModel } from "../../../models/fetch-ml-options.model"
import { fetchMl } from "../fetcher-api.ml.service"

const sendMessageToBuyer = async ({
  msg,
  userId,
  packId,
}: {
  msg: string
  userId: string
  packId: string
}) => {
  const data = {
    option_id: "OTHER",
    text: msg,
  }
  const headers = {
    "Content-Type": "application/json",
    accept: "application/json",
  }
  const options: FetchMlOptionsModel = {
    userId,
    data,
    method: "POST",
    headers,
  }

  const r = await fetchMl(
    `/messages/action_guide/packs/${packId}/option?tag=post_sale`,
    options
  )

  return r
}

export { sendMessageToBuyer }
