const Admin = require('../../models').Admin
const Video = require('../../models').Video
const Tag = require('../../models').Tag
const Vcurl = require('../../models').Vcurl
const Comment = require('../../models').Comment

var debug = false; //内部判断是否创建了新值

const c_admin = { username :"testName" ,password :"testPassword", ip :"192.168.1.1" ,nickname:'测试管理员' ,privileges :['超级管理员']}   //注册信息。
const c_video = { title : '测试视频' ,digest :'测试内容' ,url :'http://baidu.com' , tags :[] ,thumb_url :'http://baidu.com' }  //测试video
const c_tag = '测试标签';
const c_vcurl = {name :"1.mp4" ,url:'http://www.baidu.com'};
var c_comment = {ip :'192.168.1.1' ,content :'这是一条测试评论'};

//创建所有可能用到的数据
exports.ready = async function(){
  let admin = await Admin.createAdmin(c_admin),
      video = await Video.saveVideo(c_video),
      tag   = await Tag.saveTag(c_tag),
      vcurl = await Vcurl.saveVcurl(c_vcurl.name,c_vcurl.url);
  Object.assign(c_comment,{ video_id :video.data._id})
  let comment = await Comment.saveComment(c_comment);
  if(admin.success && video.success && tag.success && vcurl.success && comment.success){
    exports.Admin = admin;
    exports.Video = video;
    exports.Tag = tag;
    exports.Vcurl = vcurl;
    exports.Comment = comment;
    debug = true;
    return true;
  }else{
    return false;
  }
}

//删除所有创建的测试数据
exports.end = async function(){
  if(debug){
    let admin   = await Admin.RemoveAdmin(exports.Admin.data._id),
        video   = await Video.removeVideo(exports.Video.data._id),
        tag     = await Tag.RemoveTag(exports.Tag.data._id),
        vcurl   = await Vcurl.removeVcurl(exports.Vcurl.data._id),
        comment = await Comment.removeCommentById(exports.Comment.data._id);
    if(admin.success && video.success && tag.success && vcurl.success && comment.success){
      return true;
    }
  }else{
    return false;
  }
}
