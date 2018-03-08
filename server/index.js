const express = require('express')
const app = express()
const http = require('http')

// 中间件
app.use((req, res, next) => {
  // 解决ajax跨域问题
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild')
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
  next()
})

// 获取当前城市所有线路以及站点信息
app.post('/', (req, res) => {
  // 发送的时候统一 retCode message data
  let obj = {}
  // 异步
  new Promise((resolve, reject) => {
    http.get('http://map.amap.com/service/subway?_1469083453978&srhdata=3100_drw_shanghai.json', response => {
      //获取response的数据 
      response.on('data', chunk => {
        obj.data += chunk
      })
      response.on('end', () => {
        obj.retCode = 200
        obj.message = 'success'
        obj.data = JSON.parse(obj.data.replace('undefined', ''))
        resolve(obj)
      })
    }).on('error', err => {
      obj.retCode = -1
      obj.message = err.message
      reject(obj)
    })
  }).then(obj => {
    // console.log('promise:', obj)
    res.send(obj)
  })



})

const server = app.listen(3000, function () {
  const host = server.address().address
  const port = server.address().port

  console.log('metro-server listening at http://%s:%s', host, port)
})