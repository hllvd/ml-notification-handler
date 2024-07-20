import DynamoDB from "aws-sdk/clients/dynamodb"
import { Entity } from "electrodb"
import {
  AWS_DDB_HOST,
  AWS_DDB_NAME,
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
} from "../constants"

const dynamoDBClient = new DynamoDB.DocumentClient({
  region: AWS_REGION,
  endpoint: AWS_DDB_HOST,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
})

// highlight-next-line
const table = AWS_DDB_NAME

export const appConfigRepository = new Entity(
  {
    model: {
      entity: "appconfig",
      version: "1",
      service: "config",
    },
    attributes: {
      clientId: {
        type: "string",
        required: true,
      },
      configKey: {
        type: "string",
        required: true,
      },
      configValue: {
        type: "any",
      },
    },
    indexes: {
      byClientId: {
        pk: {
          field: "PK",
          composite: ["clientId"],
        },
        sk: {
          field: "SK",
          composite: ["configKey"],
        },
      },
    },
  },
  { client: dynamoDBClient, table }
)
