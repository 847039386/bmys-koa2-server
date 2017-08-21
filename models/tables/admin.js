const mongoose = require("mongoose");
const UUID = require('uuid');
const Util = require('../../common/util');
const easy = require('../easy')

const AdminSchema = new mongoose.Schema({
    nickname :{ type :String },
    username :{ type :String ,unique: true },
    password :{ type :String },
    privileges :[{ type :String }],      //权限
    token :{ type :String },
    token_time : { type :Date ,default :Date.now },       //token生成时间。。超过一定时间没有更新token则将阻止一切操作。 如登陆的时候刷新touken
    oldip :{ type :String },
    newip :{ type :String },
    create_at :{ type :Date ,default :Date.now }
});

/**
 * 添加用户
 */
AdminSchema.statics.createAdmin = async function(admin){
   let info = await easy.create.call(this,{
     nickname : admin.nickname,
     username : admin.username,
     password : admin.password,
     token : UUID.v1(),
     oldip : admin.ip,
     newip : admin.ip,
     privileges : admin.privileges || []
   })
   return info;
}

/**
 * 查询只有一条数据
 */
AdminSchema.statics.findOneAdmin = async function(options){
  let info = await easy.queryOne.call(this,options)
  return info;
}
//删除用户
AdminSchema.statics.RemoveAdmin = async function(id) {
  let info = await easy.removeById.call(this, id)
  return info
}

/**
 * 注册
 */
AdminSchema.statics.register = async function(admin){
   let info ,user ,new_user;
   info = { success : false ,msg :'Registration failed'}
   user = await this.findOneAdmin({username :admin.username});
   if(user.success){
     info.msg = 'This user has been used';
   }else{
     new_user = await this.createAdmin(admin);
     if(new_user.success){
       info = { success : true ,msg :'Registration success' ,data :new_user.data }
     }
   }
   //e.msg是当发生异常的时候监听的错误信息
   if(user && user.e_msg || new_user && new_user.e_msg){
     info.msg =''
     info.e_msg = user.e_msg || new_user.e_msg;
   }
   return info;
}

/**
 * 修改本表。
 * @param admin {Object} 其中参数为本表内除_id的所有数据
 * @returns {Promise}  data || null
 */
AdminSchema.statics.updateAdmin = async function(id,admin){
    let info = await easy.updateById.call(this,id,admin)
    return info
}

/**
 * 登陆  他只返回 token 与 token_time ,暴露出方法接口。
 * @param admin {Object} [username ,password ,ip]
 * @returns {Promise}  data || null
 */
AdminSchema.statics.login = async function (admin){
   let user ,new_user ,info;
   user = await this.findOneAdmin({ username :admin.username ,password :admin.password })
   if(user.success){
     let new_token, new_token_time;
     new_token = UUID.v1() ;
     new_token_time = Date.now();
     new_user = await this.updateAdmin(user.data._id,{ token :new_token ,token_time :new_token_time ,oldip :user.data.newip ,newip :admin.ip })
     if(new_user.success){
       info = {
         success :true ,
         msg :'login success' ,
         data :{
           token :new_token
           ,token_time :new_token_time
           ,nickname :new_user.data.nickname
           ,oldip :user.data.newip
           ,newip :admin.ip
           ,privileges :new_user.data.privileges
         }
       }
     }
   }else{
     info = { success :false ,msg :'Your user name and password combination was not correct. Please try again' }
   }
   if(user && user.e_msg || new_user && new_user.e_msg){
     info.msg =''
     info.e_msg = user.e_msg || new_user.e_msg;
   }
   return info;
}


/**
 * touken认证。他判断用户是否拿有令牌。
 * @param token {String}
 * @returns {Promise}  data || null
 */
AdminSchema.statics.token_auth = async function (token){
    let user ,info ,ctd;
    info = { success :false ,msg :'Failed to validate token'}
    user = await this.findOneAdmin({ token :token })
    if(user.success){
       ctd = Util.calculateTimeDifference(user.data.token_time,1000 * 60 * 60 * 2)  //认证token过期时间
       if(ctd){
         info.success = true;
         info.msg = "Authentication token success"
         info.data = { token :user.data.token ,token_time :user.data.token_time , privileges :user.data.privileges }
       }else{
         info.msg = "Token expiration"
       }
    }
    if(user && user.e_msg){
      info.msg =''
      info.e_msg = user.e_msg;
    }
    return info
}



module.exports = mongoose.model("admin", AdminSchema);

// (async function(){
//    //创建一个超级管理员的权限
//    let a = await module.exports.register({nickname :"小王" ,username :"3" ,password :"3", ip :"192.168.1.1" ,privileges :['超级管理员']})  //生成一个管理员
// }())
