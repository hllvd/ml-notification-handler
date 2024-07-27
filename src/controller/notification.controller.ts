import * as fs from "fs"
import * as dotenv from "dotenv"
import { ndJsonReadAll, ndJsonWrite } from "../repository/ndjson.repository"
import { notificationModel } from "../models/notification.model"
import { sendMessageToBuyerFromShipment } from "../service/ml/api/shipments"
import { getOnlyNumbers } from "../utils/filter-by-number.util"
dotenv.config()

const receiver = async (req, res) => {
  console.log("Init receiver")
  if (req.query.token !== "2d2aedde-728c-473c-a1a2-cfaef52057f4")
    res.json({ error: "Invalid token" })

  const body: notificationModel = req.body
  const entityShipment = "shipments"

  try {
    const { topic } = body
    if (topic == entityShipment)
      await ndJsonWrite({ filename: entityShipment, jsonObjRow: body })
    /**
     * # Hack context
     * While ML response should be under 500ms, we need to wait for
     * a while to get messages from the queue.
     * In other words, performance here is important
     */
    setTimeout(async () => {
      for await (const obj of ndJsonReadAll(entityShipment)) {
        const { user_id: userId, topic, resource }: notificationModel = obj
        const shipmentId = getOnlyNumbers(resource)
        console.log(userId, shipmentId)
        const r = await sendMessageToBuyerFromShipment({ userId, shipmentId })
        console.log(r)
      }
    }, 10000)

    res.json({})
  } catch (error) {
    console.error("Error sending message:", error)
    res.status(500).json({ error: "Error sending message", ...error })
  }
}

export default {
  receiver,
}
