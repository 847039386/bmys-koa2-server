const debug = require('debug')('bmys:test')
const app = require('../app.test');
const request = require('supertest')(app);
const should = require('should')
const support = require('../support/support')

var d_tag;

describe('标签操作 test/controllers/tag.test.js', function () {
  it('#/admin/tag/add_vcurl 创建一个标签', function (done) {
    const params = {tag :'测试标签2' ,token :support.Admin.data.token}
    request.post('/admin/tag/add_tag').expect(200).send(params)
    .end(function (err, res) {
      res.type.should.equal('application/json');
      let json = JSON.parse(res.text);
      d_tag = json
      json.success.should.be.ok();
      done(err);
    });
  });
  it('#/tags 标签查询 > 1', function (done) {
    const params = {tag :'测试标签2' ,token :support.Admin.data.token}
    request.get('/tags').expect(200).query(params)
    .end(function (err, res) {
      res.type.should.equal('application/json');
      let json = JSON.parse(res.text);
      json.success.should.be.ok();
      (json.count > 1).should.be.ok();
      done(err);
    });
  });
  it('#/admin/tag/removeById 标签删除', function (done) {
    const params = { id :d_tag.data._id ,token :support.Admin.data.token }
    request.post('/Admin/tag/removeById').expect(200).send(params)
    .end(function (err, res) {
      res.type.should.equal('application/json');
      let json = JSON.parse(res.text);
      json.success.should.be.ok();
      done(err);
    });
  });
});
