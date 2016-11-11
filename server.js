import express from 'express'
import path from 'path'
import webpack from 'webpack'
import webpackMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import config from './webpack.config'
import bodyParser from 'body-parser'

const port = 3000
const app = express()
const compiler = webpack(config)
const middleware = webpackMiddleware(compiler, {
  publicPath: config.output.publicPath,
  contentBase: 'src',
  stats: {
    colors: true,
    hash: true,
    timings: true,
    chunks: true,
    chunkModules: false,
    modules: false
  }
})

app.use(bodyParser.json())
app.use(middleware)
app.use(webpackHotMiddleware(compiler))
app.get('*', function response (req, res) {
  res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/index.html')))
  res.end()
})

app.listen(port, '0.0.0.0', function onStart (err) {
  console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port)
})
