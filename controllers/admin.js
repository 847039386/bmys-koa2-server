const AdminUser = require('../models').Admin




exports.registerAdmin = async function (ctx, next){
  let user = await AdminUser.register({
    nickname :ctx.request.body.nickname,
    username :ctx.request.body.username,
    password :ctx.request.body.password,
    ip :ctx.ip,
    privileges :[]
  })
  ctx.body = user
}

exports.login = async function (ctx, next){
  let info = await AdminUser.login({username :ctx.request.body.username ,password :ctx.request.body.password ,ip :ctx.ip })
  ctx.body = info
}

exports.token = async function (ctx, next){
  let info = await AdminUser.token_auth("dd6439d0-7276-11e7-8ee6-bfd88e50c5a3")
  ctx.body = info
}
