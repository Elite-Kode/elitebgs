const express = require('express')
const logger = require('morgan')
const { createProxyMiddleware } = require('http-proxy-middleware')
const bodyParser = require('body-parser')

const { backend, frontend } = require('./processVars')

const app = express()

app.use(createProxyMiddleware(['/api', '/auth', '/frontend'], { target: backend }))
app.use(createProxyMiddleware({ target: frontend }))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(logger('dev'))
  app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    res.send({
      message: err.message,
      error: JSON.parse(JSON.stringify(err, getCircularReplacer()))
    })
    console.log(err)
  })
}

// production error handler
// no stacktraces leaked to user
if (app.get('env') === 'production') {
  app.use(logger('combined'))
  app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    res.send({
      message: err.message,
      error: {}
    })
  })
}

module.exports = app
