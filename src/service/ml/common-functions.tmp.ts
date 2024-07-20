import { CommonResponseMLApi } from "../../models/shipment-api-response.model"
import { fetchMl } from "./fetcher-api.ml.service"

const resourceFetcher = async ({
  resource,
  userId,
}: {
  resource: string
  userId: string
}): Promise<CommonResponseMLApi | any> => {
  let order_id,
    pack_id,
    shipment_id = null
  let r = await fetchMl(`/${resource}}`, { userId })
  console.log(r)
  order_id = r?.order_id && order_id
  pack_id = r?.pack_id && pack_id
  shipment_id = r?.shipment_id && shipment_id
  if (r?.order_id) {
    const orderId = r?.order_id
    const ordersResult = await fetchMl(`/orders/${orderId}`, {
      method: "POST",
      userId,
    })
    order_id = ordersResult?.order_id && order_id
    pack_id = ordersResult?.pack_id && pack_id
    shipment_id = ordersResult?.shipment_id && shipment_id
  }

  return {
    order_id,
    pack_id,
    shipment_id,
    resource,
  }
}

export default { resourceFetcher }
