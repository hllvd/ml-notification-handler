import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs"
import fs from "fs"
import * as dotenv from "dotenv"
import notificationService from "../service/message-processing.service"
dotenv.config()

const receiver = async (req, res) => {
  console.log("Init receiver")
  if (req.query.token !== "2d2aedde-728c-473c-a1a2-cfaef52057f4")
    res.json({ error: "Invalid token" })

  const created = new Date().toISOString().slice(0, 19).replace("T", " ")
  const body = req.body
  const payload = { ...body, created }
  const payloadSerialized = JSON.stringify(payload)
  const sqsClient = new SQSClient({ region: "sa-east-1" })

  const input = {
    QueueUrl: process.env.QUEUE_URL,
    MessageBody: payloadSerialized,
  }
  console.log("Preparing command")
  const command = new SendMessageCommand(input)

  try {
    console.log("Sending message")
    await sqsClient.send(command)

    /**
     * # Hack context
     * While ML response should be under 500ms, we need to wait for
     * a while to get messages from the queue.
     * In other words, performance here is important
     */
    setTimeout(async () => {
      // await notificationService.processMessages()
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
