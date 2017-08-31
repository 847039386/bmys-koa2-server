const mongoose = require("mongoose");
const config = require('../config')
mongoose.connect(`mongodb://${config.db.host}:${config.db.port || 27017 }/${config.db.database}`, {
    poolSize :20,
    useMongoClient :true,
}, function (err) {
    if (err) {
        process.exit(1);
    }
});
mongoose.Promise = global.Promise;




var admin = require("./tables/admin")
var video = require("./tables/video")
var tag = require("./tables/tag")
var vcurl = require("./tables/vcurl")
var feedbackMsg = require('./tables/feedbackMsg')
var comment = require('./tables/comment')


exports.Admin = admin
exports.Video = video
exports.Tag = tag
exports.Vcurl = vcurl
exports.FeedbackMsg = feedbackMsg
exports.Comment = comment


//默认注册一个超级管理员。
admin.register({
  nickname :"超级管理员",
  username :config.admin.username,
  password :config.admin.password,
  privileges : ["超级管理员"]
})
