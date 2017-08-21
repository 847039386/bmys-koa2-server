const debug = require('debug')('bmys:test')
const app = require('../app.test');
const request = require('supertest')(app);
const should = require('should')
const support = require('../support/support')

var d_feedbackMsg;

describe('操作反馈信息 test/controllers/feedbackMsg.test.js', function () {
  it('#/saveFeedbackMsg 创建一条反馈信息', function (done) {
    const params = {content :'这是一条反馈信息' }
    request.post('/saveFeedbackMsg').expect(200).send(params)
    .end(function (err, res) {
      res.type.should.equal('application/json');
      let json = JSON.parse(res.text);
      d_feedbackMsg = json
      json.success.should.be.ok();
      done(err);
    });
  });
  it('#/feedbackMsg 查看反馈信息 > 0', function (done) {
    const params = { }
    request.get('/feedbackMsg').expect(200).query(params)
    .end(function (err, res) {
      res.type.should.equal('application/json');
      let json = JSON.parse(res.text);
      json.success.should.be.ok();
      (json.count > 0).should.be.ok()
      done(err);
    });
  });
    it('#/admin/fbmsg/removeFBMSG 删除一条反馈信息', function (done) {
      const params = {token :support.Admin.data.token.toString() ,id:d_feedbackMsg.data._id.toString() }
      request.post('/admin/fbmsg/removeFBMSG').expect(200).send(params)
      .end(function (err, res) {
        res.type.should.equal('application/json');
        let json = JSON.parse(res.text);
        d_comment = json
        json.success.should.be.ok();
        done(err);
      });
    });
});
