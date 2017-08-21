const fs = require('fs')
const path = require('path')
const qn = require('qn')
const debug = require('debug')('bmys:fileRemove')
const config = require('../config')


exports.readConfigJSON = function(file_path){
  let json_config = false,
      exists = fs.existsSync(file_path);
  if(exists){
    let file_data = fs.readFileSync(file_path)
    try {
      json_config = JSON.parse(file_data.toString())
    } catch (e) { }
  }
  return json_config;
}

exports.calculateTimeDifference = function(oldDate ,time){
  let newDate = new Date()
  oldDate = new Date(oldDate)
  if(oldDate.getTime() + time > newDate.getTime() ){
    return true;
  }else{
    return false;
  }
}
