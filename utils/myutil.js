var dateFormat = require('date-format');

var Util = {
  // 점수를 별로 환산한다.
  toStar: function(satisfaction){
    var star = "";
    for(var i=0; i<Math.floor(satisfaction); i++){
      star += "★";
    }
    if(Math.round(satisfaction) > Math.floor(satisfaction)){
      star += "☆";
    }
    return star;
  },
  getDay: function(){
    return dateFormat.asString('yyyy-MM-dd', new Date());
  },
  getTime: function(){
    return dateFormat.asString('yyyy-MM-dd hh:mm:ss', new Date());
  }
}

module.exports = Util;
