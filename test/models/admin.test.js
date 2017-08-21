const assert = require('assert')
const Admin = require('../../models').Admin

var basic_info = {username :"username" ,password :"password", ip :"192.168.1.1"} //基本信息 or 正确密码
var register_info = Object.assign({} ,basic_info ,{nickname:'小张' ,privileges :['普通管理员']})   //注册信息。
var login_e_info = Object.assign({} ,basic_info ,{password :'error password'})  //错误密码



describe('Admin 用户管理员表 test/models/admin.test.js', function () {
  it('模拟一个用户', async function () {
    userAdmin = await Admin.register(register_info);
    assert.ok(userAdmin.success)
  })
  it('修改用户信息', async function () {
    let info = await Admin.updateAdmin(userAdmin.data._id ,{ nickname :'admin'});
    assert.ok(info.success)
  })
  it('登陆成功', async function () {
    let info = await Admin.login(basic_info);
    Object.assign(userAdmin.data ,info.data)
    assert.ok(info.success)
  })
  it('登陆失败', async function () {
    let info = await Admin.login(login_e_info);
    assert.ifError(info.success)
  })
  it('正确的token', async function () {
    let info = await Admin.token_auth(userAdmin.data.token);
    assert.ok(info.success)
  })
  it('错误的token', async function () {
    let info = await Admin.token_auth("ERROR TOKEN");
    assert.ifError(info.success)
  })
  it('过期的token', async function () {
    await Admin.updateAdmin(userAdmin.data._id ,{ token_time :new Date('2001-01-01')});
    let info = await Admin.token_auth(userAdmin.data.token);
    assert.ifError(info.success)
  })

  it('删除用户 有ID值 通过', async function () {
    let info = await Admin.RemoveAdmin(userAdmin.data._id);
    assert.ok(info.success)
  })
  it('删除用户 错误的ID值 报错', async function () {
    let info = await Admin.RemoveAdmin(userAdmin.data._id);
    assert.ifError(info.success)
  })

})
