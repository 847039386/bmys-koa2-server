const router = require('koa-router')()

const auth = require('../middlewares').auth
const other = require('../middlewares').other

const Admin = require('../controllers').Admin
const Video = require('../controllers').Video
const Tag = require('../controllers').Tag
const Vcurl = require('../controllers').Vcurl
const Upload = require('../controllers').Upload
const FeedbackMsg = require('../controllers').FeedbackMsg
const Comment = require('../controllers').Comment
const Setting = require('../controllers').Setting


router.prefix('/admin')

router.get('/', async (ctx, next) => {
  ctx.body = 'Hello Koa 2! this is a Admin'
})

router.post('/register', Admin.registerAdmin)       //注册
router.post('/login', Admin.login)      //登陆
router.post('/upload-video/:token',Upload.video)        //上传视频
router.post('/upload-thumbnail/:token',Upload.thumbnail)        //上传头像


router.post('/fbmsg/removeFBMSG',auth.auth_token ,auth.auth_permission(),FeedbackMsg.remove)   //删除反馈信息

router.post('/tag/add_tag' ,auth.auth_token ,auth.auth_permission("标签管理") ,Tag.saveTag)   //添加标签
router.post('/tag/removeById' ,auth.auth_token ,auth.auth_permission("标签管理") ,Tag.removeById)   //删除标签
router.post('/tag/update' ,auth.auth_token ,auth.auth_permission("标签管理") ,Tag.update)   //修改标签

router.post('/vcurl/add_vcurl' ,auth.auth_token ,auth.auth_permission("上传") ,Vcurl.saveVcurl)   //添加视频临时地址
router.post('/vcurl/removeById',auth.auth_token ,auth.auth_permission(),Vcurl.removeById)     //根据ID删除视频临时路径

router.post('/video/create_video' ,auth.auth_token ,auth.auth_permission() ,other.delVcurl,Video.saveVideo) //创建新视频
router.post('/video/update_video' ,auth.auth_token ,auth.auth_permission() ,Video.updateVideo) //修改视频
router.post('/video/removeById',auth.auth_token ,auth.auth_permission(),Video.removeById)   //根据ID删除一个视频，并且删除该文件

router.post('/comment/removeById' ,Comment.removeById)   //根据ID删除一条评论
router.post('/comment/removeByVideo' ,Comment.removeByVideo)   //删除符合一个Videoid中的所有评论


router.get('/setting/getWeb' ,auth.auth_token ,auth.auth_permission(),Setting.getWebSetting)   //查询当前web的配置文件
router.post('/setting/setWeb' ,auth.auth_token ,auth.auth_permission(),Setting.setWebSetting)   //修改当前web的配置文件










module.exports = router
