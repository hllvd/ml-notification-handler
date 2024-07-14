import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs"
import * as dotenv from "dotenv"
dotenv.config()

const notification = async (req, res) => {
  console.log("here")
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

  const command = new SendMessageCommand(input)

  try {
    const response = await sqsClient.send(command)
    res.json({})
  } catch (error) {
    console.error("Error sending message:", error)
    res.status(500).json({ error: "Error sending message" })
  }
}

export default {
  notification,
}
