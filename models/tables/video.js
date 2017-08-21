const mongoose = require("mongoose");
const easy = require("../easy");


const VideoSchema = new mongoose.Schema({
    title :{ type :String },                            //标题
    digest :{ type :String },             //介绍
    tags :[{ type :mongoose.Schema.Types.ObjectId ,ref: 'tag' }],                  //标签
    create_at : { type :Date ,default :Date.now },      //创建时间
    url :{ type :String},
    thumb_url :{ type :String },
});

//查询视频
VideoSchema.statics.queryVideo = async function(options){
  let info = await easy.queryAll.call(this,options)
  return info;
}

/**
 * 删除一条数据
 */
VideoSchema.statics.removeVideo = async function(id){
  let info = await easy.removeById.call(this,id)
  return info
}

/**
 * 添加一条数据
 */
VideoSchema.statics.saveVideo = async function(video){
  let info = await easy.create.call(this,{
    title : video.title,
    digest : video.digest,
    tags : video.tags || [],
    url : video.url || '',
    thumb_url : video.thumb_url || '',
  })
  return info;
}


/**
 * 根据videoId查询一条数据
 */
VideoSchema.statics.findOneVideo = async function(options){
  let info = await easy.queryOne.call(this,options)
  return info
}



/**
 * 根据video_id修改一条数据
 */
VideoSchema.statics.updateVideo = async function(id,query){
  let info = await easy.updateById.call(this,id,query)
  return info
}


module.exports = mongoose.model("video", VideoSchema);
