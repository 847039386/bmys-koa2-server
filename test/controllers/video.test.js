const debug = require('debug')('bmys:test')
const app = require('../app.test');
const request = require('supertest')(app);
const should = require('should')
const support = require('../support/support')

var videoData = { title :'测试标题通过' ,url :'http://baidu.com' ,thumb_url :'http://baidu.com' ,digest:'测试修改简介'}
var d_video;  //即将存储单个视频 与videoDate不同的是。他将不对全局的测试数据进行操作

describe('操作视频系列 test/controllers/video.test.js', function () {
  it('#/admin/video/create_video 创建视频 无权限则失败', function (done) {
    const params = videoData
    request.post('/admin/video/create_video').expect(200).send(params)
    .end(function (err, res) {
      res.type.should.equal('application/json');
      JSON.parse(res.text).success.should.not.be.ok();
      done(err);
    });
  });
  it('#/admin/video/create_video 创建视频 有权限则通过', function (done) {
    const params = Object.assign(videoData ,{token :support.Admin.data.token})
    request.post('/admin/video/create_video').expect(200).send(params)
    .end(function (err, res) {
      res.type.should.equal('application/json');
      let json = JSON.parse(res.text);
      JSON.parse(res.text).success.should.be.ok();
      d_video = json;
      debug('为了缩短时间,只验证一次token,以下操作将是有权限的判断.')
      done(err);
    });
  });
  it('#/videos 查询视频 > 1', function (done) {
    const params = { }
    request.get('/videos').expect(200).query(params)
    .end(function (err, res) {
      res.type.should.equal('application/json');
      let json = JSON.parse(res.text);
      json.success.should.be.ok();
      (json.count > 1).should.be.ok();
      done(err);
    });
  });
  it('#/admin/video/removeById 删除视频', function (done) {
    const params = Object.assign({},{id: d_video.data._id ,token :support.Admin.data.token})
    request.post('/admin/video/removeById').expect(200).send(params)
    .end(function (err, res) {
      let json = JSON.parse(res.text);
      JSON.parse(res.text).success.should.be.ok();
      done(err);
    });
  });
  it('#/admin/video/update_video 修改视频', function (done) {
    const params = Object.assign(videoData ,{id :support.Video.data._id })
    request.post('/admin/video/update_video').expect(200).send(params)
    .end(function (err, res) {
      JSON.parse(res.text).success.should.be.ok();
      done(err);
    });
  });
});
