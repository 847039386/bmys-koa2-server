process.on('unhandledRejection', (reason, p) => {
    console.log("Unhandled Rejection at: Promise ");
});

/**
 * 查询
 * @param options {Object} 参数选项
 *     field {string} 查询字段
 *     page  {number} 页数，这个页数从1开始。即便是0也是1
 *     limit {number} 每页数据条数
 *     populate {string|Object} 跨表查询  如果这个字段是。Object类型，则populat自动为不跨表查询。则这个参数自动变为query
 *     sort {Object}  排序条件
 *     query {Object} 符合的条件
 * @returns {Promise}
 * promise的返回值为
 * success     {boolean} : 成功Or失败
 * data        {Object}  : 数据
 * currentPage {number}  : 当前页数
 * limitPage   {number}  : 每页最多可容纳几条数据
 * totalPage   {number}  : 总页数
 * count       {number}  : 总数据条数
 */
exports.queryAll = async function(options){
  let page ,field ,limit ,populate ,query ,sort ,models ,result ,info ,countp ,count ,error_msg ,success_msg;
  //一些参数
  options = options || {}
  page = parseInt(options.page) ? parseInt(options.page) : 0
  limit  = parseInt(options.limit) ? parseInt(options.limit) : 99
  field = options.field || ''
  populate = options.populate || ''
  query = options.query || {}
  sort = options.sort || {_id :-1}
  success_msg = 'query success'
  error_msg = 'query failed'
  //查库语句
  models = new Promise((res,rej) => {
    this.find(query || {}).skip((page == 0 ? 0 : page - 1) * limit).populate(populate).select(field).limit(limit).sort(sort).exec((err,data) => {
       err ? rej(err) : res(data)
    })
  })
  countp = new Promise((res,rej) => {
    this.count(query || {}).exec((err,data) => {
       err ? rej(err) : res(data)
    })
  })
  info = { success :false , msg :error_msg}
  try {
    result = await models;
    count = await countp;
    info = { success :true , msg :success_msg , data : result , currentPage :page == 0 ? 1 : page ,limitPage :limit ,totalPage :Math.ceil(count/limit)  ,count :count}

  } catch (e) {
      info.e_msg = e;
  }
  return info;
}

//删除 按ID删除
exports.removeById = async function(id){
   let info ,datas,model ,result;
   info = { success :false ,msg :'removeById failed' }
   if(id){
     model = new Promise((res,rej) => {
       this.findByIdAndRemove(id).exec((err,data) => {
         err ? rej(err) : res(data)
       })
     })
      try {
        result = await model;
        if(result){
          info = { success :true ,msg :'removeById success' ,data :result }
        }
      } catch (e) {
          info.e_msg = e;
      }
   }
   return info;
}

//删除按条件
exports.remove = async function(query){
   let info ,datas,model ,result;
   info = { success :false ,msg :'removeQuery failed' }
   if(query && typeof query == 'object'){
     model = new Promise((res,rej) => {
       this.remove(query).exec((err,data) => {
         err ? rej(err) : res(data)
       })
     })
      try {
        result = await model;
        if(result){
          info = { success :true ,msg :'removeQuery success' ,data :result }
        }
      } catch (e) {
          info.e_msg = e;
      }
   }
   return info;
}

/**
 * 新增
 * @param model {Object} 数据的model
 * @returns {Promise}
 * promise的返回值为
 * success {boolean} : 成功Or失败
 * data    {Object}  : 数据
 * msg     {number}  : 信息
 */
exports.create = async function(model){
   let info ,schema ,datas;
   info = { success :false ,msg :'add failed' }
   if(model){
      schema = new Promise((res,rej) => {
        this.create(model,(err,data) =>{
          err ? rej(err) : res(data)
        })
      })
      try {
        datas = await schema;
        if(datas){
          info = { success :true ,msg :'add success' ,data :datas }
        }
      } catch (e) {
          info.e_msg = e;
      }
   }
   return info;
}

/**
 * 修改
 * @param id {String} 数据的id
 * @param model {Object} 修改后的数据
 * @returns {Promise}
 * promise的返回值为
 * success {boolean} : 成功Or失败
 * data    {Object}  : 数据
 * msg     {number}  : 信息
 */
 exports.updateById = async function(id,model){
    let info ,schema ,datas;
    info = { success :false ,msg :'updata failed' }
    if(model && id){
       schema = new Promise((res,rej) => {
         this.findByIdAndUpdate(id,model,(err,data) =>{
           err ? rej(err) : res(data)
         })
       })
       try {
         datas = await schema;
         if(datas){
           info = { success :true ,msg :'add success' ,data :datas }
         }
       } catch (e) {
           info.e_msg = e;
       }
    }
    return info;
 }

 /**
  * 查询单个
  * 如果参数为 {String} 类型 则按ID 查询所有。
  * 如果参数为 {object} 类型
  *   1:判断是否有子集query 如果没有query则参数就是查询语句
  *   2:判断是否有子集query 如果有 则query为查询语句。并可以传参（populate与field）
  *   3:判断是否有子集id 如果有ID 则按ID 查询 并可以传参子集（populate与field）
  * @param options {String|object} 数据的id或者query
  */
  exports.queryOne = async function(options){
     let info ,datas ,model;
     info = { success :false ,msg :'findOne failed' }
     if(options && typeof options == 'string'){
       model = new Promise((res,rej) => {
         this.findById(options,(err,data) =>{
           err ? rej(err) : res(data)
         })
       })
     }else if(options && typeof options == 'object'){
       if( options.id && !options.query){
         if(options.id){
           model = new Promise((res,rej) => {
             this.findById(options.id).populate(options.populate || '').select(options.field || '').exec((err,data) =>{
               err ? rej(err) : res(data)
             })
           })
         }
       }else{
         let query ,populate ,field
         populate = ''
         field = ''
         if(options.query){
           query = options.query
           populate = options.populate || ''
           field = options.field || ''
         }else{
           query = options;
         }
         model = new Promise((res,rej) => {
           this.findOne(query || {}).populate(populate).select(field).exec((err,data) =>{
             err ? rej(err) : res(data)
           })
         })
       }
     }
     try {
       if(model){
         datas = await model;
         if(datas){
           info = { success :true ,msg :'findOne success' ,data :datas }
         }
       }
     } catch (e) {
         info.e_msg = e
     }
     return info;
  }
