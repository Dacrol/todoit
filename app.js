// Require
const express = require('express')
const flexjson = require('jsonflex')()
const compression = require('compression')

const app = express()

app.use(compression())
app.use(flexjson)
app.use(express.static('public'))

/* eslint-disable */
app.get(/^[^\.]*$/, (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
})
/* eslint-enable */

// Start server
app.listen(3000, () =>
  console.log('Webserver listening on port 3000')
)
