import { Request, Response } from "express"
import * as dotenv from "dotenv"
import { sendMessageToBuyerFromShipment } from "../service/ml/api/shipments"
import { sendMessageToBuyer } from "../service/ml/api/message"

dotenv.config()

const test = async (req: Request, res: Response) => {
  // const r = await commonFunctionsTmp.resourceFetcher({
  //   resource: "shipments/43614875040",
  //   userId: "1231084821",
  // })
  const shipmentId = req.query?.shipmentId?.toString()
  const orderId = req.query?.orderId?.toString()
  if (!shipmentId && !orderId)
    res.json({ message: "shipmentId or orderId should entered" })

  const userId = "1231084821"
  let r
  if (shipmentId)
    r = await sendMessageToBuyerFromShipment({ userId, shipmentId })
  if (orderId) {
    const msg =
      "Olá! Esperamos que tenha gostado do seu produto! Sua opinião é muito importante para nós. Por favor, considere deixar uma avaliação no Mercado Livre. Obrigado!"

    r = await sendMessageToBuyer({ msg, userId, packId: orderId })
  }
  res.status(200).json({ ...r })
}

export default {
  test,
}
