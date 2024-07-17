import {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from "@aws-sdk/client-sqs"
import * as fs from "fs"
import * as path from "path"
import * as dotenv from "dotenv"
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
    const outputFilePath = path.join(homeDir, "message.output.txt")

    if (messages) {
      for (const message of messages) {
        //const messageInJsonFormat = JSON.parse(message.Body)

        // Process the message
        console.log(`Message Body: ${message.Body}`)
        fs.appendFileSync(outputFilePath, `${message.Body}\n ---------- \n\n`)

        // Delete the processed message
        const deleteParams = {
          QueueUrl: queueUrl,
          ReceiptHandle: message.ReceiptHandle,
        }
        await sqsClient.send(new DeleteMessageCommand(deleteParams))
      }
    } else {
      console.log("No messages to process.")
    }
  } catch (err) {
    console.error("Error processing messages:", err)
  }
}

export default {
  processMessages,
}
