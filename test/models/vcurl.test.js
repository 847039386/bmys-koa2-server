const assert = require('assert')
const Vcurl = require('../../models').Vcurl

const basic_info = {name :"1.mp4" ,url:'http://www.baidu.com'} //基本信息 or 正确密码
var vcurlObj;


describe('Vcurl 视频地址暂存表 test/models/vcurl.test.js', function () {
  it('增加视频地址信息', async function () {
    vcurlObj = await Vcurl.saveVcurl(basic_info.url,basic_info.name)
    assert.ok(vcurlObj.success)
  })
  it('查询视频地址信息', async function () {
    let info = await Vcurl.queryVcurl()
    assert.ok(info.success)
  })
  it('删除视频地址信息', async function () {
    let info = await Vcurl.removeVcurl(vcurlObj.data._id)
    assert.ok(info.success)
  })
})
