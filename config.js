const path = require('path')

module.exports = {
    app: {
      port : 3000,      //端口
      testPort : 3333   //测试端口，一样将不能同时执行
    },
    //数据库信息
    db: {
      host : '127.0.0.1',
      port : 27017,   //不填则默认27017端口mongodb
      database :'beimen'
    },
    // redis
    redis: {
      host :'127.0.0.1',
      port : 6379
    },
    //上传路径或者本地
    upload: {
        qn_access: {
            accessKey :'01oKerp-WnA-ou7DANLaWuSHdKuhk2xInjJ40BxR',
            secretKey :'ivC4BvoVljlkNmR4HdTQV84jSuXna97Kz8siWoSU',
            bucket :'beimenwenhua',
            origin :'http://ounyawd00.bkt.clouddn.com',
            uploadURL :'http://up-z1.qiniu.com'
        },
    },
    websetting :{
      path :'web.setting.json',   //webstting的位置。于app的位置
      key :'redis_websetting'   //存在redis里的key值
    },
    //超级管理员的信息
    admin :{
      username : 'admin',
      password : 'admin',
      email : '847039386@qq.com'
    }
}
