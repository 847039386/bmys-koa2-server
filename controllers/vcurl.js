const Vcurl = require('../models').Vcurl

exports.saveVcurl = async function (ctx, next){
  let vcurl = await Vcurl.saveVcurl(ctx.request.body.url,ctx.request.body.name)
  ctx.body = vcurl
}

exports.queryVcurl = async function (ctx, next){
  let vcurl = await Vcurl.queryVcurl()
  ctx.body = vcurl
}

exports.removeById = async function (ctx, next){
  let vcurl = await Vcurl.removeVcurl(ctx.request.body.id)
  ctx.body = vcurl
}
