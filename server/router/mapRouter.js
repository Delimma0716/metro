/**
 * 与地铁图有关的路由
 */
const express = require('express')
const http = require('http')
const mapRouter = express.Router()

/**
 * 获取当前城市所有线路以及站点信息
 * 直接get数据返回
 */
mapRouter.post('/getlines', (req, res) => {
  // 发送的时候统一 retCode message data
  let code = req.body.code
  let city = req.body.city
  let obj = {}
  // 异步
  new Promise((resolve, reject) => {
    http.get('http://map.amap.com/service/subway?_1469083453978&srhdata=' + code + '_drw_' + city + '.json', response => {
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
    }).on('error', () => {
      obj.retCode = -1
      obj.message = '网络暂不可用'
      reject(obj)
    })
  }).then(obj => {
    res.send(obj)
  }, obj => {
    res.send(obj)
  })
})

/**
 * 获取某个站点信息
 * 1.get drw中的站点信息
 * 2.get info中的站点信息
 * 3.拼装后返回
 */
mapRouter.post('/getstinfo', (req, res) => {
  // 发送的时候统一 retCode message data
  let code = req.body.code
  let city = req.body.city
  let si = req.body.si
  let obj = {}
  let drwData = ''
  let infoData = ''

  let getDrwData = function () {
    let p = new Promise((resolve, reject) => {
      http.get('http://map.amap.com/service/subway?_1469083453978&srhdata=' + code + '_drw_' + city + '.json', response => {
        // 获取response的数据
        response.on('data', chunk => {
          drwData += chunk
        })
        response.on('end', () => {
          drwData = JSON.parse(drwData.replace('undefined', ''))
          resolve(drwData)
        })
      }).on('error', () => {
        obj.retCode = -1
        obj.message = '网络暂不可用'
        reject(obj)
      })
    })
    return p
  }

  let getInfoData = function () {
    let p = new Promise((resolve, reject) => {
      http.get('http://map.amap.com/service/subway?_1469083453978&srhdata=' + code + '_info_' + city + '.json', response => {
        // 获取response的数据
        response.on('data', chunk => {
          infoData += chunk
        })
        response.on('end', () => {
          infoData = JSON.parse(infoData.replace('undefined', ''))
          resolve(drwData, infoData)
        })
      }).on('error', () => {
        obj.retCode = -1
        obj.message = '网络暂不可用'
        reject(obj)
      })
    })
    return p
  }

  getDrwData().then(drwData => {
    console.log(drwData)
    return getInfoData()
  }).then(infoData => {
    console.log(infoData)
  })
})

module.exports = mapRouter
