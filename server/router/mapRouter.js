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
          resolve(infoData)
        })
      }).on('error', () => {
        obj.retCode = -1
        obj.message = '网络暂不可用'
        reject(obj)
      })
    })
    return p
  }

  /**
   * 1.根据n-站点名称或si-站点编码从drwData中获取具体站点{}
   * 2.根据si从infoData中取出{}
   * 需要的信息:r-所在的全部线路, ls-为起点的线路,n-终点站编码,lt-末班时间,ft-首班时间)
   * 需要函数:
   * 1.getStFromDrw(si,drw) return {n-名称,r-路线}
   * 2.getStFromInfo(si,info) return {d-班车信息}
   * 3.getData({},{}) return {lines[],[{line,finalst,ft,st}]}
   * 4.getLineName(si,drw) return string
   * 5.getStName(si,drw) return string
   * 需要的参数:
   * si-站点编码
   */
  let analyseData = function () {
    let p = new Promise((resolve, reject) => {

    })
    return p
  }

  getDrwData().then(drwData => {
    console.log(drwData)
    return getInfoData()
  }, obj => {
    res.send(obj)
  }).then(infoData => {
    console.log(infoData)
    return getInfoData()
  }, obj => {
    res.send(obj)
  }).then(obj => {
    res.send(obj)
  }, obj => {
    res.send(obj)
  })
})

module.exports = mapRouter
