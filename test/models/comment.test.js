const assert = require('assert')
const Video = require('../../models').Video
const Comment = require('../../models').Comment

var videoObj ,commentObj;
const basic_info = {ip :'192.168.1.1' ,content :'这是一条测试评论'}

describe('Comment 评论表 test/models/comment.test.js', function () {

  it('增加无视频的评论则报错', async function () {
    let info = await Comment.saveComment(basic_info)
    assert.ifError(info.success)
  })
  it('增加视频', async function () {
    videoObj = await Video.saveVideo({ title : '测试视频' ,digest :'测试内容' })
    assert.ok(videoObj.success)
  })
  it('为该视频添加5条评论', async function () {
    Object.assign(basic_info ,{ video_id :videoObj.data._id })
    for(let i=0; i<5; i++){
      commentObj = await Comment.saveComment(basic_info)
    }
    assert.ok(commentObj.success)
  })
  it('删除视频', async function () {
    let info = await Video.removeVideo(videoObj.data._id)
    assert.ok(info.success)
  })
  it('删除单条评论', async function () {
    let info = await Comment.removeCommentById(commentObj.data._id)
    assert.ok(info.success)
  })
  it('删除该视频下的所有评论', async function () {
    let info = await Comment.removeComment({ video_id :videoObj.data._id})
    assert.ok(info.success)
  })
})
