const app = require('../app.test');
const should = require('should')
const request = require('supertest')(app);
const Admin = require('../../models').Admin

var admin_d;

describe('操作管理员 test/controllers/admin.test.js', function () {
  it('#/admin/register 注册', function (done) {
    const user = {nickname :"测试人员" ,username :"MOCHAMOCHAMOCHA" ,password :"MOCHAMOCHAMOCHA" , privileges :[]}
    request.post('/admin/register').send(user).end(function (err, res) {
      res.statusCode.should.equal(200);
      res.type.should.equal('application/json');
      let json = JSON.parse(res.text);
      admin_d = json
      json.success.should.be.ok();
      done(err);
    });
  });
  it('#/admin/login 登陆', function (done) {
    const user = {username:"2",password:"2"}
    request.post('/admin/login').send(user).end(function (err, res) {
      res.statusCode.should.equal(200);
      res.type.should.equal('application/json');
      done(err);
    });
  });
  it('删除用户 有ID值 通过', async function () {
    let info = await Admin.RemoveAdmin(admin_d.data._id);
    info.success.should.be.ok();
  })
});
