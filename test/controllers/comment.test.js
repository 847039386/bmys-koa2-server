const debug = require('debug')('bmys:test')
const app = require('../app.test');
const request = require('supertest')(app);
const should = require('should')
const support = require('../support/support')

var d_comment;

describe('操作评论信息 test/controllers/comment.test.js', function () {
  it('#/saveComment 为测试视频创建一条评论', function (done) {
    const params = {video_id :support.Video.data._id.toString() ,content :'这是一条测试评论' }
    request.post('/saveComment').expect(200).send(params)
    .end(function (err, res) {
      res.type.should.equal('application/json');
      let json = JSON.parse(res.text);
      d_comment = json
      json.success.should.be.ok();
      done(err);
    });
  });
  it('#/getComment 查询一条视频下的评论 > 1', function (done) {
    const params = {video_id :support.Video.data._id.toString() }
    request.get('/getComment').expect(200).query(params)
    .end(function (err, res) {
      res.type.should.equal('application/json');
      let json = JSON.parse(res.text);
      json.success.should.be.ok();
      //这里因为全局测试数据本身video底下就默认创建了一条数据所里这里count比对两条数据
      (json.count > 1).should.be.ok();
      done(err);
    });
  });
  it('#/admin/comment/removeById 删除一条视频下的评论', function (done) {
    const params = {id :d_comment.data._id.toString() }
    request.post('/admin/comment/removeById').expect(200).send(params)
    .end(function (err, res) {
      res.type.should.equal('application/json');
      let json = JSON.parse(res.text);
      json.success.should.be.ok();
      //这里因为全局测试数据本身video底下就默认创建了一条数据所里这里count比对两条数据
      done(err);
    });
  });
});
