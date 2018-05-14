/**
 * 普通用户路由
 */
const express = require('express')
const userRouter = express.Router()

const db = require('../db')

const data = {}

// 登录
userRouter.post('/login', (req, res) => {
  let username = req.body.username
  let password = req.body.password
  // 查询用户表
  let sql = 'SELECT userPwd FROM user WHERE userName = ?'
  db.query(sql, [username], (err, rows) => {
    if (err) {
      data.retCode = 0
      data.msg = '系统内部错误'
      res.json(data)
      console.log('error:', err)
    } else {
      if (rows.length === 0) {
        data.retCode = -1
        data.msg = '用户名不存在'
        res.json(data)
      } else {
        if (rows[0].userPwd === password) {
          data.retCode = 1
          data.msg = '登录成功'
          res.json(data)
        } else {
          data.retCode = -1
          data.msg = '密码错误'
          res.json(data)
        }
      }
    }
  })
})

// 注册
userRouter.post('/register', (req, res) => {
  let username = req.body.username
  let password = req.body.password
  let sql = 'SELECT userPwd FROM user WHERE userName = ?'
  db.query(sql, [username], (err, rows) => {
    if (err) {
      data.retCode = 0
      data.msg = '系统内部错误'
      res.json(data)
      console.log('error:', err)
    } else {
      if (rows.length === 1) {
        data.retCode = -1
        data.msg = '用户名已存在'
        res.json(data)
      } else {
        let sql2 = 'INSERT INTO user(userName,userPwd) VALUES (?,?)'
        db.query(sql2, [username, password], (err, rows) => {
          if (err) {
            data.retCode = 0
            data.msg = '系统内部错误'
            res.json(data)
            console.log('error:', err)
          } else {
            let data = {}
            data.retCode = 1
            data.msg = '注册成功'
            res.json(data)
          }
        })
      }
    }
  })
})

// 添加提醒
userRouter.post('/addalarm', (req, res) => {
  let username = req.body.username
  let type = req.body.type
  let value = req.body.value
  let sql = 'INSERT INTO  alarm(userName,alType,alValue) VALUES (?,?,?)'
  db.query(sql, [username, type, value], (err, rows) => {
    if (err) {
      data.retCode = 0
      data.msg = '系统内部错误'
      res.json(data)
      console.log('error:', err)
    } else {
      let data = {}
      data.retCode = 1
      data.msg = '添加成功'
      res.json(data)
    }
  })
})

// 获取用户所有提醒
userRouter.post('/getalarms', (req, res) => {
  let username = req.body.username
  // 查询用户表
  let sql = 'SELECT * FROM alarm WHERE userName = ?'
  db.query(sql, [username], (err, rows) => {
    if (err) {
      data.retCode = 0
      data.msg = '系统内部错误'
      res.json(data)
      console.log('error:', err)
    } else {
      data.retCode = 1
      data.msg = rows
      res.json(data)
    }
  })
})

// 获取用户常用地址
userRouter.post('/getaddrs', (req, res) => {
  let username = req.body.username
  // 查询用户表
  let sql = 'SELECT userHome , userCompany , userSchool FROM user WHERE userName = ?'
  db.query(sql, [username], (err, rows) => {
    if (err) {
      data.retCode = 0
      data.msg = '系统内部错误'
      res.json(data)
      console.log('error:', err)
    } else {
      data.retCode = 1
      data.msg = rows
      res.json(data)
    }
  })
})

// 设置常用地址
userRouter.post('/setaddr', (req, res) => {
  let username = req.body.username
  let addr = req.body.addr
  let stat = req.body.stat
  let sql = ''
  switch (addr) {
    case '家':
      sql = 'UPDATE user SET userHome = ? WHERE userName = ?'
      break
    case '公司':
      sql = 'UPDATE user SET userCompany = ? WHERE userName = ?'
      break
    case '学校':
      sql = 'UPDATE user SET userSchool = ? WHERE userName = ?'
      break
  }
  db.query(sql, [stat, username], (err, rows) => {
    if (err) {
      data.retCode = 0
      data.msg = '系统内部错误'
      res.json(data)
      console.log('error:', err)
    } else {
      data.retCode = 1
      data.msg = rows
      res.json(data)
    }
  })
})

module.exports = userRouter
