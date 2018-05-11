const express = require('express')
const app = express()

const mapRouter = require('./router/mapRouter')
const userRouter = require('./router/userRouter')

const bodyParser = require('body-parser')
// for parsing application/json
app.use(bodyParser.json())
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// 中间件
app.use((req, res, next) => {
  // 解决ajax跨域问题
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild')
  res.header('Access-Control-Allow-Methods', '*')
  // 缓存预检命令 5分钟 chrome不可用
  res.header('Access-Control-Max-Age', '600')
  next()
})

// 与地铁图有关的路由
app.use('/map', mapRouter)
// 与用户有关的路由
app.use('/user', userRouter)

const server = app.listen(3000, function () {
  const host = server.address().address
  const port = server.address().port

  console.log('metro-server listening at http://%s:%s', host, port)
})