// Require
const express = require('express');
const flexjson = require('jsonflex')();
const compression = require('compression');

const app = express();

app.use(compression());
app.use(flexjson);
app.use(express.static('www'));

app.get(/^[^\.]*$/, (req, res) => {
  res.sendFile(__dirname + '/www/index.html');
});

// Start server
app.listen(3000, () =>
  console.log('Webserver listening on port 3000')
);
