import { APIGatewayEvent, Context } from 'aws-lambda'

const handler = async (event?: APIGatewayEvent, context?: Context) => {
  return {
    statusCode: 200,
    body: 'hello world',
  }
}
export { handler }
