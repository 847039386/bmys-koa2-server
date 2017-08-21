var fs = require('fs')
var path = require("path");
var url = require("url");
var mimeNames = {
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
  ".wav": "audio/x-wav",
  ".webm": "video/webm",

};

var K2 = function(options){
   this.initFolder = options.initFolder;
   this.ctx = options.ctx
   this.next = options.next
}

K2.prototype.readRangeHeader = function(range, totalLength) {
  if (range == null || range.length == 0)
    return null;

  var array = range.split(/bytes=([0-9]*)-([0-9]*)/);
  var start = parseInt(array[1]);
  var end = parseInt(array[2]);
  var result = {
    Start: isNaN(start) ? 0 : start,
    End: isNaN(end) ? (totalLength - 1) : end
  };

  if (!isNaN(start) && isNaN(end)) {
    result.Start = start;
    result.End = totalLength - 1;
  }

  if (isNaN(start) && !isNaN(end)) {
    result.Start = totalLength - end;
    result.End = totalLength - 1;
  }

  return result;
}

K2.prototype.typeValidation = function(){
  var that = this
  var ContentType;
  var exists = fs.existsSync(path.join(that.initFolder,that.ctx.path))
  var ext = path.extname(that.ctx.path)
  if(ext && exists){
    ContentType = mimeNames[ext] ? mimeNames[ext] : null;
  }else{
    ContentType = null;
  }
  return ContentType;
}

K2.prototype.init = function(){
  var contentType = this.typeValidation()
  if(contentType){
    this.splitContent(contentType)
    return true;
  }else{
    return false;
  }
}

K2.prototype.splitContent = function (contentType){
  let filepath ,stat ,file ,rangeRequest,that
  that = this;
  filepath = path.join(that.initFolder,that.ctx.path)
  stat = fs.statSync(filepath)
  file = fs.createReadStream(filepath)
  rangeRequest = that.readRangeHeader(that.ctx.request.get('range'),stat.size)
  if(rangeRequest == null){
    that.ctx.status = 200
    that.ctx.set({
      'Content-Type': contentType,
      "Content-Length":stat.size,
      "Accept-Ranges":'bytes'
    })
    that.ctx.body = file
  }else{
    var start ,end ,fp_file
    start = rangeRequest.Start
    end   = rangeRequest.End

    if (start >= stat.size || end >= stat.size) {
     that.ctx.set('Content-Range','bytes */' + stat.size)
     that.ctx.status = 416
    }

    that.ctx.set({
      'Content-Range' :'bytes ' + start + '-' + end + '/' + stat.size,
      'Content-Length' :start == end ? 0 : (end - start + 1),
      'Content-Type' : contentType,
      'Accept-Ranges' :'bytes',
      'Cache-Control' :'no-cache'
    })

    that.ctx.status = 206
    fp_file = fs.createReadStream(filepath,{ start: start,  end: end})
    that.ctx.body = fp_file
  }
}




module.exports = function(options) {
   if(options && options.initFolder){
     return function(ctx ,next){
       var k2 = new K2({
         initFolder:options.initFolder,
         ctx :ctx,
         next : next
       })
       if(!k2.init()){
        return next()
       }
     }
   }else{
     return function(ctx,next){
       return next()
     }
   }


}
