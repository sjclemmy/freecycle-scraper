const http = require('http')
const host = 'localhost'
const port = 3000

const requestListener = function (req, res) {
  if (req.method === 'GET') {
    res.writeHead(200)
    res.end('Hello, World!')
  }
  if (req.method === 'POST') {
    let data = ''

    req.on('data', (chunk) => {
      // Collect the incoming data
      data += chunk
    })
    req.on('end', () => {
      // The entire payload has been received
      console.log('Received payload:', data)

      // Parse the payload if desired
      const parsedData = new URLSearchParams(data)
      console.log('Parsed payload:', Object.fromEntries(parsedData))
      res.setHeader('Set-Cookie', 'mySteve=whatever; Path=/;')
      // Send response
      res.statusCode = 200
      res.end('Payload received')
    })
  }
}

const server = http.createServer(requestListener)
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`)
})
