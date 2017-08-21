const mongoose = require("mongoose");
const easy = require('../easy')

//评论表
const CommentSchema = new mongoose.Schema({
    ip :{ type :String },
    video_id :{ type :mongoose.Schema.Types.ObjectId ,ref: 'video' ,required :true },
    content :{type :String },
    create_at :{  type :Date ,default :Date.now},                            //标题
});

//查询所有
CommentSchema.statics.queryComment = async function(options){
  let info = await easy.queryAll.call(this,options)
  return info;
}

// 根据id删除数据
CommentSchema.statics.removeCommentById = async function(id){
    let info = await easy.removeById.call(this,id)
    return info
}
// 根据条件删除数据
CommentSchema.statics.removeComment = async function(query){
    let info = await easy.remove.call(this,query)
    return info
}

/**
 * 添加一条数据
 */
CommentSchema.statics.saveComment = async function(comment){
  let info = await easy.create.call(this,comment)
  return info;
}


module.exports = mongoose.model("comment", CommentSchema);
