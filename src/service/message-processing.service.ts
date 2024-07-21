import {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from "@aws-sdk/client-sqs"
import * as fs from "fs"
import * as path from "path"
import * as dotenv from "dotenv"
import { sendMessageToBuyerFromShipment } from "./ml/api/shipments"

dotenv.config()

const sqsClient = new SQSClient({ region: "sa-east-1" })
const queueUrl = process.env.QUEUE_URL

async function processMessages() {
  try {
    const receiveParams = {
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 10, // Adjust as needed
      VisibilityTimeout: 60, // Adjust as needed (in seconds)
      WaitTimeSeconds: 20, // Adjust as needed
    }

    const data = await sqsClient.send(new ReceiveMessageCommand(receiveParams))
    const messages = data.Messages
    const homeDir = process.env.HOME || process.env.USERPROFILE
    const outputFilePath = path.join(homeDir, "logs.output.txt")

    if (messages) {
      for (const message of messages) {
        const messageInJsonFormat = JSON.parse(message.Body)
        const { resource, topic, userId } = messageInJsonFormat
        const msg = `
            resource : ${resource && "null"} \n
            topic : ${topic && "null"} \n
          `
        fs.appendFileSync(outputFilePath, `${msg}\n\n `)
        const shipmentPattern = /^\/shipments\/(\d+)$/
        const matchShipmentResource = resource.match(shipmentPattern)
        if (matchShipmentResource) {
          const shipmentId = resource.replace(/\D/g, "")
          const messageResponse = sendMessageToBuyerFromShipment({
            userId,
            shipmentId,
          })
          fs.appendFileSync(
            outputFilePath,
            `${JSON.stringify(messageResponse)}\n `
          )
        }

        //fs.appendFileSync(outputFilePath, `${JSON.stringify(mlApiResult)}`)
        fs.appendFileSync(outputFilePath, ` ----------- \n\n\n`)
        // Process the message

        // Delete the processed message
        _deleteMessage(queueUrl, message.ReceiptHandle)
      }
    } else {
      console.log("No messages to process.")
    }
  } catch (err) {
    console.error("Error processing messages:", err)
  }
}

async function _deleteMessage(queueUrl: string, receiptHandle: any) {
  const deleteParams = {
    QueueUrl: queueUrl,
    ReceiptHandle: receiptHandle,
  }
  await sqsClient.send(new DeleteMessageCommand(deleteParams))
}

export default {
  processMessages,
}
