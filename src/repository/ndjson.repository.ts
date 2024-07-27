import * as fs from "fs"
import { createReadStream } from "fs"

import * as path from "path"
import { Transform } from "stream"

const homeDir = process.env.HOME || process.env.USERPROFILE
const dirPath = path.join(homeDir, "tmp.notification")

const ndJsonWrite = async ({
  filename,
  jsonObjRow,
}: {
  filename: string
  jsonObjRow: any
}) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
  const outputFilePath = _getFilePath(filename)
  fs.appendFileSync(outputFilePath, `${JSON.stringify(jsonObjRow)}\n`)
}

async function* ndJsonReadAll(filename: string): AsyncGenerator<any> {
  const filePath = _getFilePath(filename)
  if ((await fs.existsSync(dirPath)) == false) return
  const stream = createReadStream(filePath, { encoding: "utf8" })

  const parser = new Transform({
    objectMode: true,
    transform(chunk, _, done) {
      for (const line of chunk.toString().split("\n")) {
        if (line.trim()) {
          try {
            this.push(JSON.parse(line))
          } catch (err) {
            this.emit("error", err)
          }
        }
      }
      done()
    },
  })

  stream.pipe(parser)

  for await (const obj of parser) {
    yield obj
  }
  _clearFile(filename)
}

const _clearFile = (filename) => {
  const filePath = _getFilePath(filename)
  fs.writeFileSync(filePath, "")
}
const _getFilePath = (filename) =>
  path.join(homeDir, "tmp.notification", `${filename}.ndjson`)

export { ndJsonWrite, ndJsonReadAll }
