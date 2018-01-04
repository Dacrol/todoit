// Require
const express = require('express')
const flexjson = require('jsonflex')({jsonDir: '/public/json'})
const compression = require('compression')
const path = require('path')

const app = express()

app.use(compression())
app.use(flexjson)
app.use(express.static('public'))

app.get(/^[^.]*$/, (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'))
})

// Start server
app.listen(3000, () =>
  console.log('Webserver listening on port 3000')
)
