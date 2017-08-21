const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require('koa-cors');
const k2_range = require('./middlewares/k2_range')
const config = require('./config')
const redis = require('promise-redis')()
const redisClient = redis.createClient(config.redis);

const index = require('./routes/index')
const admin = require('./routes/admin')


app.use(async (ctx,next) => {
  ctx.redis = redisClient;
  await next();
})
// error handler
// onerror(app)

// middlewares
app.use(k2_range({initFolder:'public'}))
app.use(cors());    //跨域
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
// app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// routes
app.use(index.routes(), index.allowedMethods())
app.use(admin.routes(), admin.allowedMethods())


module.exports = app
