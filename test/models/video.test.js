const assert = require('assert')
const Video = require('../../models').Video

var videoObj;
const basic_info = { title : '测试视频' ,digest :'测试内容' }

describe('Video 视频表 test/models/feedbackMsg.test.js', function () {
  it('新增视频信息', async function () {
    videoObj = await Video.saveVideo(basic_info)
    assert.ok(videoObj.success)
  })
  it('增加错误的tag标签', async function () {
    let info = await Video.saveVideo(Object.assign({} ,basic_info ,{tags :["ERRORTAGS"]}))
    assert.ifError(info.success)
  })
  it('修改视频信息', async function () {
    Object.assign(basic_info ,{ url :'http://www.baidu.com'})
    let info = await Video.updateVideo(videoObj.data._id ,basic_info)
    assert.ok(info.success)
  })
  it('查询一条视频信息', async function () {
    let info = await Video.findOneVideo(videoObj.data._id.toString())
    assert.ok(info.success)
  })
  it('查询多条视频信息', async function () {
    let info = await Video.queryVideo()
      assert.ok(info.success)
  })
  it('删除视频信息', async function () {
    let info = await Video.removeVideo(videoObj.data._id)
    assert.ok(info.success)
  })
})
