import https from 'https'
import { parse } from './parse'

const getOptions = {
  hostname: 'www.freecycle.org',
  port: 443,
  path: '/home/dashboard',
  method: 'GET',
  headers: {
    'Content-Type': 'text/html',
  },
}

const postOptions = {
  hostname: 'www.freecycle.org',
  port: 443,
  path: '/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
}

const getLatestPosts = async (cookie: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const req = https.get(
      { ...getOptions, headers: { ...getOptions.headers, Cookie: cookie } },
      (res) => {
        let data: string = ''

        res.on('data', (d) => {
          data += d
        })
        res.on('end', () => {
          resolve(data)
        })
      }
    )
    req.on('error', (error) => {
      console.error(error)
      reject({ status: 500, body: 'error' })
    })
  })

const getLoginCookie = async (): Promise<string> =>
  new Promise((resolve, reject) => {
    const req = https.request(postOptions, (res) => {
      res.on('data', (d) => d)
      res.on('end', () => {
        resolve(res?.headers?.['set-cookie']?.[0] as string)
      })
    })
    req.on('error', (error) => {
      console.error(error)
      reject({ status: 500, body: 'error' })
    })

    const formData = new URLSearchParams()
    formData.append('user', `${process.env['USERNAME']}`)
    formData.append('password', `${process.env['PASSWORD']}`)

    req.write(formData.toString())
    req.end()
  })

const handler = async () => {
  const cookie = await getLoginCookie()
  const latestPosts = await getLatestPosts(cookie.split(';')[0] as string)
  console.log(await parse(latestPosts))
  return { statusCode: 200, body: 'processed' }
}
export { handler }
