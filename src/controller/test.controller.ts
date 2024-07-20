import { Request, Response } from "express"
import * as dotenv from "dotenv"
import { sendMessageToBuyerFromShipment } from "../service/ml/api/shipments"

dotenv.config()

const test = async (req: Request, res: Response) => {
  // const r = await commonFunctionsTmp.resourceFetcher({
  //   resource: "shipments/43614875040",
  //   userId: "1231084821",
  // })
  const shipmentId = req.query?.sid?.toString()
  if (!shipmentId) res.json({ message: "shipmentId is required" })
  const userId = "1231084821"
  const r = await sendMessageToBuyerFromShipment({ userId, shipmentId })
  res.status(200).json({ ...r })
}

export default {
  test,
}
