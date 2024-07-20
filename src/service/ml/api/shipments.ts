import { FetchMlOptionsModel } from "../../../models/fetch-ml-options.model"
import { ShipmentApiResponseModel } from "../../../models/shipment-api-response.model"
import { fetchMl } from "../fetcher-api.ml.service"
import { sendMessageToBuyer } from "./message"

const getShipmentByShipmentId = async ({
  shipmentId,
  userId,
}: {
  shipmentId: string
  userId: string
}): Promise<ShipmentApiResponseModel> => {
  const shipmentIDString = shipmentId.toString()
  const options: FetchMlOptionsModel = {
    userId,
  }
  const r = await fetchMl(`/shipments/${shipmentIDString}`, options)
  return r
}

const getOrderByOrderId = async ({
  orderId,
  userId,
}: {
  orderId: string
  userId: string
}): Promise<any> => {
  const shipmentIDString = orderId.toString()
  const options: FetchMlOptionsModel = {
    userId,
  }
  const r = await fetchMl(`/orders/${shipmentIDString}`, options)
  return r
}

const sendMessageToBuyerFromShipment = async ({ shipmentId, userId }) => {
  const responseFromShipment = await getShipmentByShipmentId({
    shipmentId,
    userId,
  })
  const responseFromOrder = await getOrderByOrderId({
    orderId: responseFromShipment.order_id,
    userId,
  })

  const packId = responseFromOrder?.pack_id || responseFromShipment?.order_id
  const msg =
    "Olá! Esperamos que tenha gostado do seu produto! Sua opinião é muito importante para nós. Por favor, considere deixar uma avaliação no Mercado Livre. Obrigado!"
  const r = await sendMessageToBuyer({ msg, userId, packId })
  return r
}

const getUser = async ({
  shipmentId,
  userId,
}: {
  shipmentId: number
  userId: string
}): Promise<any> => {
  const shipmentIDString = shipmentId.toString()
  const options: FetchMlOptionsModel = {
    userId,
  }
  const r = await fetchMl(`/users/494492998`, options)
  return r
}

export {
  getShipmentByShipmentId,
  getOrderByOrderId,
  sendMessageToBuyerFromShipment,
}
