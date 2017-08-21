const assert = require('assert')
const Tag = require('../../models').Tag

var tagID = ''

describe('Tag 标签表 test/models/tag.test.js', function () {

  it('增加标签', async function () {
    let tag = await Tag.saveTag("京东商城")
    tagID = tag.data._id
    assert.ok(tag.success)
  })
  it('添加重复标签 ', async function () {
    let tag = await Tag.saveTag("京东商城")
    assert.ifError(tag.success)
  })
  it('查询第一页数据', async function () {
    let tag = await Tag.queryTag({ page : 1 })
    assert.equal(tag.currentPage,1)
  })
  it('查询特定标签:正确ID值 ', async function () {
    let tag = await Tag.findOneTag(tagID.toString())
    assert.ok(tag.success)
  })
  it('查询特定标签:错误的ID值 ', async function () {
    let tag = await Tag.findOneTag('ERROR')
    assert.ifError(tag.success)
  })
  it('修改标签:正确ID值 ', async function () {
    let model ,tag
    model = { name :'百度外卖' }
    tag = await Tag.UpdateTag(tagID,model)
    assert.ok(tag.success)
  })
  it('修改标签:错误的ID值 ', async function () {
    let model ,tag
    model = { name :'百度外卖' }
    tag = await Tag.UpdateTag("TEST",model)
      assert.ifError(tag.success)
  })
  it('删除标签:正确ID值 ', async function () {
    let tag = await Tag.RemoveTag(tagID)
    assert.ok(tag.success)
  })
  it('删除标签:错误的ID值 ', async function () {
    let tag = await Tag.RemoveTag()
    assert.ifError(tag.success)
  })
})
