const support = require('../support/support')
const debug = require('debug')('bmys:test')
const should = require('should')

describe('创建测试数据 并进行http协议验证测试',function(){
  let ready ,end;
  before(async function(){
      ready = await support.ready();
      debug('创建测试数据',ready)
  });
  after(async function(){
      end = await support.end();
      debug('删除测试数据',end)
  });
  require('./admin.test')
  require('./video.test')
  // require('./comment.test')      //测试这两个则要开通web.setting.json
  // require('./feedbackMsg.test')
  require('./vcurl.test')
  require('./tag.test')
})
