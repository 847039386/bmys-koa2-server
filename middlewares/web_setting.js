const fs = require("fs") ;
const util = require("../common/util")
const config = require("../config")


async function handleRedisConfigJson(ctx,file_path){
  let redis_websetting = await ctx.redis.get( config.websetting.key),
      websetting = redis_websetting;
  if(!redis_websetting){
    let json_config = util.readConfigJSON(file_path);
    if(json_config){
      await ctx.redis.set(config.websetting.key,JSON.stringify(json_config))
      websetting = JSON.stringify(json_config)
    }
  }
  if(websetting){
    try {
      return JSON.parse(websetting)
    } catch (e) {
      return false;
    }
  }else{
    return false;
  }
}


exports.addCommit = async function (ctx, next){
  let info = { success :true , msg :'read success' },
      websetting = await handleRedisConfigJson(ctx ,config.websetting.path);    //这个文件位于app.js同级
  if(!websetting){
    await next();
  }else{
    if(websetting.comment){
      await next();
    }else{
      ctx.body = { success :false , msg :'对不起管理员关闭了评论功能。' }
    }
  }
}

exports.addFeedbackMsg = async function (ctx, next){
  let info = { success :true , msg :'read success' },
      websetting = await handleRedisConfigJson(ctx ,config.websetting.path);    //这个文件位于app.js同级
  if(!websetting){
    await next();
  }else{
    if(websetting.feedbackMsg){
      await next();
    }else{
      ctx.body = { success :false , msg :'对不起管理员关闭了反馈邮件功能。' }
    }
  }
}
