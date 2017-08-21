const Video = require('../models').Video
const Comment = require('../models').Comment
const util = require('../common/removeUploadFile')

exports.saveVideo = async function (ctx, next){
  let video_info,
  title = ctx.request.body.title,
  digest = ctx.request.body.digest,
  tags = ctx.request.body.tags,
  url = ctx.request.body.url,
  thumb_url = ctx.request.body.thumb_url;
  if(title && digest && url && thumb_url){
    video_info = await Video.saveVideo({
      title,digest,tags,url,thumb_url,
    })
  }else{
    video_info = {success:false ,msg :'video save faild'}
  }
  ctx.body = video_info
}
exports.updateVideo = async function (ctx, next){
  let video_info,
  id = ctx.request.body.id,
  title = ctx.request.body.title,
  digest = ctx.request.body.digest,
  tags = ctx.request.body.tags,
  url = ctx.request.body.url,
  thumb_url = ctx.request.body.thumb_url;
  if(id && title && digest && url && thumb_url){
    video_info = await Video.updateVideo(id,{
      title,digest,tags,url,thumb_url,
    })
  }else{
    video_info = {success:false ,msg :'video update faild'}
  }
  ctx.body = video_info
}

exports.queryVideo = async function (ctx ,next){
  let page ,limit ,info
  page = ctx.query.page || 1
  limit = ctx.query.limit || 10         //默认每页10条数据
  info = await Video.queryVideo({ limit :limit ,page :page ,populate :'tags'});
  ctx.body = info;
}

exports.inTagVideo = async function (ctx ,next){
  let page ,limit ,info ,tags
  tags = ctx.query.tag ? ctx.query.tag.split('/') : ''
  page = ctx.query.page || 1            //默认第一页
  limit = ctx.query.limit || 10         //默认每页10条数据
  query = ctx.query.tag ? { tags :{$in :tags }} : {}    //如没有tag参数则查所有
  info = await Video.queryVideo({ limit :limit ,page :page ,populate :'tags' ,query :query });
  console.log()
  ctx.body = info;
}

exports.blur = async function (ctx ,next){
  let page ,limit ,info
  page = ctx.query.page || 1            //默认第一页
  limit = ctx.query.limit || 10         //默认每页10条数据
  query = ctx.query.title ? { title : new RegExp(ctx.query.title) } : {}
  info = await Video.queryVideo({ limit :limit ,page :page ,populate :'tags' ,query :query });
  ctx.body = info;
}

exports.findIdVideo = async function (ctx ,next){
  if(ctx.query.id){
    info = await Video.findOneVideo({
      id :ctx.query.id,
      populate :'tags',
    });
  }else{
    info = { successs:false , msg:'not video' }
  }
  ctx.body = info;
}


exports.removeById = async function (ctx ,next){
  let video ,info ,id ,delVideo ,comment ,comments_msg;
  id = ctx.request.body.id
  comments_msg = '';
  info = { successs:false , msg:'not video' ,comments_msg :comments_msg}
  if(id){
    video = await Video.findOneVideo({id :id ,field :'url thumb_url',});
    if(video.success){
       comment = await Comment.removeComment({video_id: id})
       if(comment.success){
         comments_msg = `删除评论：${comment.data.result.n}条`
       }
       delVideo = await Video.removeVideo(id)
       if(delVideo.success){
         let rm_videoURL ,rm_videoIMG ,u_msg ,i_msg;
         rm_videoURL = await util.removeFile(video.data.url,["mp4"])
         rm_videoIMG = await util.removeFile(video.data.thumb_url,["png","jpg"])
         u_msg = rm_videoURL.success ? `视频文件删除完毕 :${video.data.url}` : `视频文件 :${rm_videoURL.msg}`;
         i_msg = rm_videoIMG.success ? `视频缩略图删除完毕 :${video.data.thumb_url}`  : `视频缩略图 :${rm_videoIMG.msg}`;
         info = { success : true , msg :`删除视频数据成功,${u_msg},${i_msg}` ,data :delVideo.data ,comments_msg :comments_msg}
       }
    }else{
       info = video
    }
  }
  ctx.body = info;
}
