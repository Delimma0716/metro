/**
 * 与地铁图有关的路由
 */
const express = require('express')
const http = require('http')
const mapRouter = express.Router()

// 获取当前城市所有线路以及站点信息
mapRouter.post('/getlines', (req, res) => {
  // 发送的时候统一 retCode message data
  let obj = {}
  // 异步
  new Promise((resolve, reject) => {
    http.get('http://map.amap.com/service/subway?_1469083453978&srhdata=3100_drw_shanghai.json', response => {
      // 获取response的数据
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

module.exports = mapRouter
