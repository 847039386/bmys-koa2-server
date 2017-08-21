const assert = require('assert')
const FeedbackMsg = require('../../models').FeedbackMsg

var feedbackMsgObj;


describe('FeedbackMsg 反馈信息表 test/models/feedbackMsg.test.js', function () {
  it('增加反馈信息', async function () {
    feedbackMsgObj = await FeedbackMsg.saveFeedBackMsg('这是一条反馈信息')
    assert.ok(feedbackMsgObj.success)
  })
  it('查询反馈信息', async function () {
    let info = await FeedbackMsg.queryFeedBackMsg()
    assert.ok(info.success)
  })
  it('删除反馈信息', async function () {
    let info = await FeedbackMsg.removeFeedBackMsg(feedbackMsgObj.data._id)
    assert.ok(info.success)
  })
})
