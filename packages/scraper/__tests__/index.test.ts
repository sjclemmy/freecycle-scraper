import { handler } from '../src'
describe('scraper', () => {
  it('should run', async () => {
    await expect(handler()).resolves.toEqual({
      statusCode: 200,
      body: 'hello world',
    })
  })
})
