const express = require('express');
const app = express();
const version = 'v0'

app.use(require(`./${version}/login`))
app.use(require(`./${version}/user`))
app.use(require(`./${version}/templates`))
app.use(require(`./${version}/pieces`))
app.use(require(`./${version}/controlguide`))
app.use(require(`./${version}/controlplan`))
app.use(require(`./${version}/machines`))
app.use(require(`./${version}/reasons`))
app.use(require(`./${version}/events`))

module.exports = app;