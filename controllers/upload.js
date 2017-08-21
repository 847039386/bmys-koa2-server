const path = require('path')
const ko2_upload = require('../common/k2_upload')
const auth = require('../middlewares/auth')
const config = require('../config')


exports.video = async function (ctx, next){
  let result;
  let info = await auth.auth_ok(ctx.params.token,"上传");
  if(info.success){
    let k2up = new ko2_upload();
    result = await k2up.init( ctx )
  }else{
     result = info;
  }
  ctx.body = result;
}

exports.thumbnail = async function (ctx, next){
  let result;
  let info = await auth.auth_ok(ctx.params.token,"上传");
  if(info.success){
    let k2up = new ko2_upload({
      uploadPath : 'public/upload/thumbnail'
    });
    result = await k2up.init( ctx )
  }else{
     result = info;
  }
  ctx.body = result;
}
