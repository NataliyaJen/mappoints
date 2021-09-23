/* const awsServerlessExpress = require('aws-serverless-express')
const app = require('./server')

const ase = awsServerlessExpress.configure({
  app,
  respondWithErrors: process.env.NODE_ENV !== 'production',
  loggerConfig: {
    level: 'debug'
  }
})

exports.handler = ase.handler */


const awsServerlessExpress = require('aws-serverless-express')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const app = require('./server')

const server = awsServerlessExpress.createServer(app)

app.use(awsServerlessExpressMiddleware.eventContext())

app.get('/', (req, res) => {
  res.json(req.apiGateway.event)
})

exports.handler = (event, context) => {
    awsServerlessExpress.proxy(server, event, context);  }
    
    