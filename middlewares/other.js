const Vcurl = require('../models').Vcurl

exports.delVcurl = async function (ctx, next){
  //这里作用于添加视频的时候判断有没有缓存视频如果有则删除。没有则直接通过。
  if(ctx.request.body.vcurl_id){
    let vcurl = await Vcurl.removeVcurl(ctx.request.body.vcurl_id);
    if(vcurl.success){
      await next();
    }else{
      ctx.body = vcurl;
    }
  }else{
    await next();
  }
}
