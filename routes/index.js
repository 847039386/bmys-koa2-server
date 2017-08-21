const router = require('koa-router')()
const Tag = require('../controllers').Tag
const Video = require('../controllers').Video
const Vcurl = require('../controllers').Vcurl
const FeedbackMsg = require('../controllers').FeedbackMsg
const Comment = require('../controllers').Comment


const websetting = require('../middlewares').websetting


router.get('/', async (ctx, next) => {
  ctx.redis.flushall()
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})


router.get('/tags' ,Tag.selectTag)   //查询标签
router.get('/videos' ,Video.queryVideo)   //查询视频
router.get('/vcurl' ,Vcurl.queryVcurl)   //查询上传地址
router.get('/feedbackMsg' ,FeedbackMsg.queryAll)   //查询反馈信息
router.get('/inTagVideo',Video.inTagVideo)    //根据标签搜索视频

router.get('/blur',Video.blur)    //模糊查询视频信息
router.get('/videoid',Video.findIdVideo)    //按照ID查询单个视频信息
router.get('/getComment',Comment.query)     //查询评论

router.post('/saveFeedbackMsg',websetting.addFeedbackMsg,FeedbackMsg.saveFeedbackMsg)    //创建反馈消息
router.post('/saveComment', websetting.addCommit , Comment.save)    //添加评论






module.exports = router
