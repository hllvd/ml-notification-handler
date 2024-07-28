import * as dotenv from "dotenv"
import { ndJsonReadAll, ndJsonWrite } from "../repository/ndjson.repository"
import { notificationModel } from "../models/notification.model"
import { sendMessageToBuyerFromShipment } from "../service/ml/api/shipments"
import { getOnlyNumbers } from "../utils/filter-by-number.util"
import { CloudSearch } from "aws-sdk"
dotenv.config()

const receiver = async (req, res) => {
  console.log("Init receiver")
  if (req.query.token !== "2d2aedde-728c-473c-a1a2-cfaef52057f4") {
    res.json({ error: "Invalid token" })
    return
  }

  const body: notificationModel = req.body
  const entityShipment = "shipments"

  const { topic } = body
  if (topic == entityShipment) {
    console.log("shipment detected")
    await ndJsonWrite({ filename: entityShipment, jsonObjRow: body })
  }

  /**
   * # Hack here
   * Because of ML response should be under 500ms, we need to decouple this sending message task
   */
  console.log("before settimeout")
  setTimeout(async () => {
    for await (const obj of ndJsonReadAll(entityShipment)) {
      const { user_id: userId, topic, resource }: notificationModel = obj
      const shipmentId = getOnlyNumbers(resource)
      if (!shipmentId) break
      console.log("SENDING_MESSAGE", resource, userId, shipmentId, topic)
      const r = await sendMessageToBuyerFromShipment({ userId, shipmentId })
      console.log(r)
      await ndJsonWrite({ filename: "messages-sent", jsonObjRow: r })
    }
  }, 5000)

  res.json({})
}

export default {
  receiver,
}
