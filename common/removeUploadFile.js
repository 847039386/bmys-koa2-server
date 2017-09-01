const fs = require('fs')
const path = require('path')
const qn = require('qn')
const config = require('../config')
const debug = require('debug')('bmys:fileRemove')



//切割host 判断域名来自本地还是网络
exports.splitHost = function(filepath){
  let data ,fileName ,reg ,host;
  data = { }
  reg = filepath.match(/(https?\:\/\/.*?)\/.*/);
  if(reg){
    host = reg[1];
  }else{
    filepath = path.normalize(filepath)
    host = filepath.split('\\').length > 1 ? filepath.split('\\')[0] : null;
  }
  return host;
}
/**
 * 删除文件
 * path 文件地址。
 * ext 允许删除的文件后缀名
 */
exports.fileLocalRemove = async function(filepath ,ext){
    debug('remove path is a ：' + filepath)
    let exists ,info ,unlink ,success;
    success = true;
    info = { success : false ,msg :''}
    //如果ext有值是数组则判断是否符合，如果是字符串则判断是否一致
    if(ext && ext instanceof Array ){
      success = false;
      info.msg = "后缀不符合"
      ext.forEach(item => {
        if(path.extname(filepath) == "." + item){
          success = true
        }
      })
    }else if(ext && typeof ext == 'string'){
      info.msg = "后缀不符合"
      success = path.extname(filepath) == "." + ext
    }
    // 成功则删除文件
    if(success){
      exists = fs.existsSync(filepath);
      if(exists){
          try {
            let unlinkPromise = new Promise((res ,rej) => {
              fs.unlink(filepath ,err => {
                err ? rej(err) : res(true)
              })
            })
            let unlink = await unlinkPromise;
            if(unlink){
              info = { success :true ,msg :'文件成功删除'}
            }
          } catch (e) {
            debug('remove file error：' + e)
            info.msg = '文件删除失败'
          }
      }else{
        info.msg = "文件不存在"
      }
    }
    return info
}
exports.qiniuRemove = async function(filepath){
  let info ,client ,split_name ,file_name ,deleteQiniu;
  info = { successs :false , msg :'出现了未知的错误'}
  client = qn.create(config.upload.qn_access);
  split_name = filepath.split('/')
  file_name = split_name[split_name.length - 1]
  deleteQiniu =  new Promise((res ,rej) => {
    client.delete(file_name,function(err){
       err ? rej(err) : res()
    })
  })
  try {
    await deleteQiniu;
    Object.assign(info,{successs :true , msg :'qiuniu删除成功'})
  } catch (e) {
    Object.assign(info,{msg :'qiniu删除出现了错误：'+ e })
  } finally {
    return info
  }
}
//按照地址的前缀判断执行本地操作还是远程操作 ，如本地删除文件。和七牛删除文件
exports.removeFile = async function(filepath ,ext){
    let info ,host ,qn;
    qn = config.upload.qn_access.origin
    info = { successs :false , msg :'出现了未知的错误'}
    host = this.splitHost(filepath)
    debug('分割后的域名：' + host)
    if(host){
      switch(host){
          case 'public':
             debug('本地删除')
             info = await exports.fileLocalRemove(filepath ,ext)
             info.msg = info.successs ? '本地删除成功' : info.msg
          break;
          case qn :
             debug('七牛删除')
             info = await exports.qiniuRemove(filepath)
          break;
          default :
             debug('未知根源则不删除')
             info.msg = '出现某些原因，找不到要删除文件的根源。'
          break
      }
    }
    return info;
}
