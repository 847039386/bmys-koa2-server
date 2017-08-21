const mongoose = require("mongoose");
const easy = require('../easy')

//这个表将缓存临时的地址。
const VcurlSchema = new mongoose.Schema({
    name :{ type :String },
    url :{ type :String ,unique: true},                            //标题
});

//查询所有
VcurlSchema.statics.queryVcurl = async function(options){
  let info = await easy.queryAll.call(this,options)
  return info;
}

// 根据id删除数据
VcurlSchema.statics.removeVcurl = async function(id){
    let info = await easy.removeById.call(this,id)
    return info
}

/**
 * 添加一条数据
 */
VcurlSchema.statics.saveVcurl = async function(url,name){
  let info = await easy.create.call(this,{ name :name ,url :url })
  return info;
}


module.exports = mongoose.model("vcurl", VcurlSchema);
