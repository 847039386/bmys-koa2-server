const app = require('../app.test');
const should = require('should')
const request = require('supertest')(app);


describe('操作管理员 test/controllers/admin.test.js', function () {
  it('#/admin/register 注册', function (done) {
    const user = {nickname :"测试人员" ,username :"mocha" ,password :"mocha" , privileges :[]}
    request.post('/admin/register').send(user).end(function (err, res) {
      res.statusCode.should.equal(200);
      res.type.should.equal('application/json');
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
});
