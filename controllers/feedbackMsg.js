const FeedbackMsg = require('../models').FeedbackMsg

exports.saveFeedbackMsg = async function (ctx, next){
  let fbm_info;
  if(ctx.request.body.content){
    fbm_info = await FeedbackMsg.saveFeedBackMsg(ctx.request.body.content)
  }else{
    fbm_info = { success:false ,msg:'请输入要反馈的信息'}
  }
  ctx.body = fbm_info
}


exports.queryAll = async function (ctx ,next){
  let info = await FeedbackMsg.queryFeedBackMsg() ;
  ctx.body = info;
}

exports.remove = async function(ctx ,next){
  let info ,id;
  id = ctx.request.body.id || null
  if(id){
    info = await FeedbackMsg.removeFeedBackMsg(id);
  }else{
    info = { success:false ,msg:'错误的ID'}
  }
  ctx.body = info
}
