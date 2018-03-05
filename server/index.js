const express = require('express')
const app = express()
const http = require('http')


app.get('/', (req, res) => {
  let obj = {}
  // 解决ajax跨域问题
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild')
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
  http.get('http://map.amap.com/service/subway?_1469083453978&srhdata=1100_drw_beijing.json', res => {
    //获取response的数据 
    res.on('data', chunk => {
      obj.retCode = 200
      obj.message = 'success'
      obj.data += chunk
      console.log('obj', obj)
    })
    console.log('obj', obj)
  })
  // 发送的时候统一 retCode message data
  res.json(obj)
})

const server = app.listen(3000, function () {
  const host = server.address().address
  const port = server.address().port

  console.log('metro-server listening at http://%s:%s', host, port)
})