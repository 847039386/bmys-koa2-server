const debug = require('debug')('bmys:test')
const app = require('../app.test');
const request = require('supertest')(app);
const should = require('should')
const support = require('../support/support')

var d_vcurl;

describe('操作反馈信息 test/controllers/feedbackMsg.test.js', function () {
  it('#/admin/add_vcurl 创建一条反馈信息', function (done) {
    const params = {name :'这是一条缓存视频信息' , url :'http://www.baidu.com/two' ,token :support.Admin.data.token}
    request.post('/admin/vcurl/add_vcurl').expect(200).send(params)
    .end(function (err, res) {
      res.type.should.equal('application/json');
      let json = JSON.parse(res.text);
      d_vcurl = json
      json.success.should.be.ok();
      done(err);
    });
  });
  it('#/vcurl 查看反馈信息 > 1', function (done) {
    const params = { }
    request.get('/vcurl').expect(200).query(params)
    .end(function (err, res) {
      res.type.should.equal('application/json');
      let json = JSON.parse(res.text);
      json.success.should.be.ok();
      (json.count > 1).should.be.ok()
      done(err);
    });
  });
  it('#/admin/vcurl/removeById 删除', function (done) {
    const params = { id : d_vcurl.data._id ,token :support.Admin.data.token}
    request.post('/admin/vcurl/removeById').expect(200).send(params)
    .end(function (err, res) {
      res.type.should.equal('application/json');
       JSON.parse(res.text).success.should.be.ok();
       done(err);
    });
  });
});
