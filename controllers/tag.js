const Tag = require('../models').Tag


exports.saveTag = async function (ctx, next){
  let tag_info = await Tag.saveTag(ctx.request.body.tag);
  ctx.body = tag_info
}

exports.selectTag = async function (ctx, next){
  let info = await Tag.queryTag();
  ctx.body = info
}

exports.removeById = async function (ctx, next){
  let info = await Tag.RemoveTag(ctx.request.body.id);
  ctx.body = info
}


exports.update = async function (ctx, next){
  let info = await Tag.UpdateTag(ctx.request.body.id ,{ name :ctx.request.body.name});
  ctx.body = info
}
