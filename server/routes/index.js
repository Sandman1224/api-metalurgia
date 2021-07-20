const express = require('express');
const app = express();
const version = 'v0'

app.use(require(`./${version}/login`))
app.use(require(`./${version}/user`))

module.exports = app;