require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
var bodyParser = require('body-parser')
const { routes } = require('./routes/routes')
const {
  newEthConnection,
  newMaticConnection,
  newStellarConnection
} = require('./blockChain/connection')

console.log("----------",process.env.ETH_CON)
const app = express()
// const env = dotenv.config({
//   path: `.env`
// })
// assert.equal(null, env.error)
// app.set("env", stage);
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())
app.use(helmet())
app.set('etag', false)

newEthConnection()
  .then(() => {
    console.log('ETH connection successful!')
  })
  .catch((error) => {
    console.error('ETH connection failed:', error)
  })

newMaticConnection()
  .then(() => {
    console.log('MATIC connection successful!')
  })
  .catch((error) => {
    console.error('MATIC connection failed:', error)
  })

newStellarConnection()
  .then(() => {
    console.log('Stellar connection successful!')
  })
  .catch((error) => {
    console.error('Stellar connection failed:', error)
  })

app.get('/', function (req, res) {
  res.send('node is running')
})
app.use('/api/v1/admin', routes)

if (module === require.main) {
  var server = app.listen(process.env.PORT || 2000, function () {
    var port = server.address().port
    console.log('Auth Service running on port %s', port)
  })
}
