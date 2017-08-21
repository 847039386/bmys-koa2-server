const Comment = require('../models').Comment


exports.save = async function (ctx, next){
  let info ,video_id ,content;
  video_id = ctx.request.body.video_id
  content = ctx.request.body.content

  if(video_id && content){
    info = await Comment.saveComment({
      ip :ctx.ip,
      video_id :video_id,
      content :content
    });
  }else{
    info = {success : false ,msg :'comment add failed'}
  }
  ctx.body = info
}

exports.query = async function (ctx, next){
  let info, videoID ,comments ,page ,limit
  page = ctx.query.page || 1
  limit = ctx.query.limit || 10
  info = { success :false , msg :'comment query failed' }
  videoID = ctx.query.video_id
  if(videoID){
    comments = await Comment.queryComment({
      query :{ video_id :videoID },
      limit :limit,
      page :page
    });
    info = comments;
  }
  ctx.body = info
}


exports.removeById = async function (ctx, next){
  let info ,id;
  id = ctx.request.body.id;
  info = {success : false ,msg :'comment removeByID failed'}
  if(id){
    info = await Comment.removeCommentById(id)
  }
  ctx.body = info;

}


exports.removeByVideo = async function (ctx, next){
  let info ,id;
  id = ctx.request.body.id;
  info = {success : false ,msg :'remove comment by Video_id failed'}
  if(id){
    info = await Comment.removeComment({video_id: id})
  }
  ctx.body = info;
}
