var isJSON = require('is-json');
var config = require('../config');
var fs = require('fs');

exports.getWebSetting = async function (ctx, next){
  let info = { success :false , msg :'读取web配置出现问题'}
  try {
    let webSetting = await ctx.redis.get(config.websetting.key)
    let data ;
    if(!webSetting){
        webSetting = fs.readFileSync(config.websetting.path,{encoding :'utf8'})
        await ctx.redis.set(config.websetting.key,webSetting)
        data = JSON.parse(webSetting);
    }else{
      data = JSON.parse(webSetting);
    }
    info = { success :true , msg :'成功' , data : data }
  } catch (e) {
    info.msg = e
  }
  ctx.body = info;
}

exports.setWebSetting = async function (ctx, next){
  let setting = ctx.request.body.setting
  let info = { success :false ,msg :'提交出现错误' }
  if(isJSON(setting)){
    try {
      fs.writeFileSync(config.websetting.path,setting,{encoding :'utf8'});
      await ctx.redis.set(config.websetting.key,setting)
      info = { success :true ,msg :'修改web配置成功！' ,data : JSON.parse(setting)}
    } catch (e) {
      info.msg = e;
    }
  }else{
    info.msg = '您提交的不是json数据。'
  }
  ctx.body = info;
}
