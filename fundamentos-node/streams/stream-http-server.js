import http from 'node:http'
import { Transform } from 'node:stream'

class InverseSignal extends Transform {

  _transform(chunk, encoding, callback) {
    const transformed = Number(chunk.toString()) * -1
    console.log(transformed)

    const buff = Buffer.from((transformed.toString()))
    callback(null, buff)
  }
}

// req => ReadableStream
// res => WritableStream

const server = http.createServer(async (req, res) => {
  const buffers = []

  for await (const chunk of req) {
    buffers.push(chunk)
  }

  const fullStreamContent = Buffer.concat(buffers).toString()
  console.log(fullStreamContent)

  return res.end(fullStreamContent)
  // return req
  //   .pipe(new InverseSignal())
  //   .pipe(res)

})

server.listen(3334)