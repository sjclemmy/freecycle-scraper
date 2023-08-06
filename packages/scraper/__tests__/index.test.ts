import { handler } from '../src'
describe('scraper', () => {
  it('should run', async () => {
    process.env.USERNAME = import.meta.env.VITE_USERNAME
    process.env.PASSWORD = import.meta.env.VITE_PASSWORD
    expect(await handler()).toEqual({
      statusCode: 200,
      body: 'processed',
    })
  })
})
