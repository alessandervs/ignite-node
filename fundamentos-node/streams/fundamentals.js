import { stdin, stdout } from 'node:process'
import { Readable, Writable, Transform } from 'node:stream'


// stdin
//   .pipe(stdout)

class OneToHundredStream extends Readable {

  index = 1

  _read() {
    const i = this.index++

    setTimeout(() => {
      if (i > 100) {
        this.push(null)
      } else {
        const buff = Buffer.from(i.toString())
        this.push(buff)
      }
    }, 1000)
  }
}

class InverseSignal extends Transform {

  _transform(chunk, encoding, callback) {
    const transformed = Number(chunk.toString()) * -1
    const buff = Buffer.from((transformed.toString()))
    callback(null, buff)
  }
}

class MultiplyByTenStreams extends Writable {
  _write(chunk, encoding, callback) {
    console.log(Number(chunk.toString()) * 10)
    callback()
  }
}

new OneToHundredStream()
  .pipe(new InverseSignal())
  .pipe(new MultiplyByTenStreams())