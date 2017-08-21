const mongoose = require("mongoose");
const easy = require('../easy')

//这个表将获取用户的反馈信息。
const feedbackMsgSchema = new mongoose.Schema({
    content :{ type :String },
    create_at :{ type :Date ,default :Date.now },                            //标题
});

//查询数据
feedbackMsgSchema.statics.queryFeedBackMsg = async function(options){
  let info = await easy.queryAll.call(this,options)
  return info;
}

// 根据id删除数据
feedbackMsgSchema.statics.removeFeedBackMsg = async function(options){
    let info = await easy.removeById.call(this,options)
    return info
}

// 创建一条数据
feedbackMsgSchema.statics.saveFeedBackMsg = async function(content){
   let info = await easy.create.call(this,{ content :content })
   return info;
}



module.exports = mongoose.model("feedbackMsg", feedbackMsgSchema);
