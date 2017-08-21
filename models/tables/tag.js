const mongoose = require("mongoose");
const easy = require('../easy')

const TagSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  }, //标题
});



//查询所有标签，他暴露出接口。
TagSchema.statics.queryTag = async function(options) {
  let info = await easy.queryAll.call(this, options)
  return info;
}


/**
 * 查询符合条件的标签 返回一个
 * @param options {Object} 标签的query
 * @returns {Promise}  data || null
 */
TagSchema.statics.findOneTag = async function(options) {
  let info = await easy.queryOne.call(this, options)
  return info
}

/**
 * 根据tagId删除一条数据
 */
TagSchema.statics.RemoveTag = async function(id) {
  let info = await easy.removeById.call(this, id)
  return info
}
/**
 * 根据tagId修改一条数据
 */
TagSchema.statics.UpdateTag = async function(id, model) {
  let info = await easy.updateById.call(this, id, model)
  return info
}

/**
 * 保存一个标签，他暴露出接口。
 * @param query {Object} 标签的query
 * @returns {Promise}  data || null
 */
TagSchema.statics.saveTag = async function(name) {
  let info = await easy.create.call(this, {
    name: name,
  })
  return info;
}


module.exports = mongoose.model("tag", TagSchema);