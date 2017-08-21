const AdminUser = require('../models').Admin


//token认证
exports.auth_token = async function (ctx, next){
  let token = ctx.params.token || ctx.query.token || ctx.request.body.token
  if(token){
    let info = await AdminUser.token_auth(token)
    if(info.success){
      ctx.privileges = info.data.privileges;
      await next()
    }else{
      ctx.body = info;
    }
  }else{
    ctx.body = { success :false ,msg :'Failed to validate token'}
  }
}

//权限认证 可传数组与字符串。如传数组则。代表这个用户必须要有数组中的全部权限方可通行。
exports.auth_permission = function(current){
  let error_info = { success :false ,msg :'Sorry, You have no permissions' }
  return async function (ctx, next){
    let privileges = ctx.privileges || [];
    if(privileges.indexOf("超级管理员") != -1){
       await next()
    }else if( typeof current === 'string'){
      if (privileges.indexOf(current) != -1){ await next() }else{ ctx.body = error_info }
    }else if( current instanceof Array ){
      let success = true;
      current.forEach(item => {
        if(privileges.indexOf(item) == -1){ success = false; }
      })
      if(success){  await next()  } else{  ctx.body = error_info   }
    }else{  ctx.body = error_info  }
  }
}

//可能有的时候需要不用中间件的方式验证身份。
exports.auth_ok = async function(token,current){
   let info = { success :false }
   let admin = await AdminUser.token_auth(token);
   if(admin.success){
      let togo = false;
      let privileges = admin.data.privileges
      if(privileges.indexOf("超级管理员") != -1){
         togo = true;
      }else if( typeof current === 'string'){
        if (privileges.indexOf(current) != -1){
          togo = true;
        }
      }else if( current instanceof Array ){
        let success = true;
        current.forEach(item => {
          if(privileges.indexOf(item) == -1){ success = false; }
        })
        if(success){  togo = true; }
      }
      if(togo){
        info.success = true;
      }else{
        info.msg = 'Sorry, You have no permissions'
      }
   }else{
      info.msg = admin.msg;
   }
   return info
}
