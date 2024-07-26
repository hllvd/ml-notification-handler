import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs"
import * as fs from "fs"
import * as path from "path"
import * as dotenv from "dotenv"
import notificationService from "../service/message-processing.service"
dotenv.config()

const receiver = async (req, res) => {
  console.log("Init receiver")
  if (req.query.token !== "2d2aedde-728c-473c-a1a2-cfaef52057f4")
    res.json({ error: "Invalid token" })

  // console.log("Before variables")
  // const created = new Date().toISOString().slice(0, 19).replace("T", " ")
  // const body = req.body
  // const payload = { ...body, created }
  // const payloadStr = JSON.stringify(payload)
  // const payloadSerialized = payloadStr
  // const sqsClient = new SQSClient({
  //   region: "sa-east-1",
  //   credentials: {
  //     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  //     secretAccessKey: process.env.AWS_ACESS_KEY,
  //   },
  // })

  // console.log("Before file")
  // const homeDir = process.env.HOME || process.env.USERPROFILE
  // console.log("Before file 2")
  // const outputFilePath = path.join(homeDir, "post.input.txt")
  // console.log("Before file 3")
  // fs.appendFileSync(outputFilePath, payloadStr)
  // fs.appendFileSync(outputFilePath, ` ----------------- \n\n`)
  // console.log("Before input")
  // const input = {
  //   QueueUrl: process.env.QUEUE_URL,
  //   MessageBody: payloadSerialized,
  // }
  // console.log("Preparing command")
  // const command = new SendMessageCommand(input)

  try {
    console.log("NO Sending message")
    //await sqsClient.send(command)

    /**
     * # Hack context
     * While ML response should be under 500ms, we need to wait for
     * a while to get messages from the queue.
     * In other words, performance here is important
     */
    // setTimeout(async () => {
    //   //await notificationService.processMessages()
    // }, 10000)

    res.json({})
  } catch (error) {
    console.error("Error sending message:", error)
    res.status(500).json({ error: "Error sending message", ...error })
  }
}

export default {
  receiver,
}
