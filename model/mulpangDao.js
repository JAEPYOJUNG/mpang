var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var util = require('util');
var path = require('path');
var clog = require('clog');
var fs = require('fs');
var MyUtil = require('../utils/myutil');

// DB 접속
var db;

console.log("===================");
// console.log(process.env.MONGO_DB);
console.log(process.env.MONGO_DB2);
console.log("===================");

MongoClient.connect(process.env.MONGO_DB2 , function(err, client){
	db = client.db('mpang');
	db.member = db.collection('member');
	db.shop = db.collection('shop');
	db.coupon = db.collection('coupon');
	db.purchase = db.collection('purchase');
	db.epilogue = db.collection('epilogue');
	console.log('DB 접속 완료.');
});

// exports = module.exports;
// return module.exports;

// 쿠폰 목록조회
exports.couponList = function(options){
  options.qs = options.qs || {};
	// 검색 조건
  var query = {};
  var now = MyUtil.getDay();
  
  // 1. 판매 시작일이 지난 쿠폰, 구매 가능 쿠폰(기본 검색조건)
  query['saleDate.start' ] = {$lte : now};
  query['saleDate.finish'] = {$gte : now};

  // 2. 구매가능/지난쿠폰/전체
  switch(options.qs.date){
    case  'past':
      query['saleDate.finish'] = {$lte: now};
      break;
    case  'all':
      delete query['saleDate.finish'];
      break;
  }	
  // 3. 지역명	
  var location = options.qs.location;
  if(location){
    query['region'] = location;
  }
  // 4. 검색어	
  var keyword = options.qs.keyword;
  if(keyword && keyword.trim() != ''){
    var regExp = new RegExp(keyword, 'i');
    query['$or'] = [{couponName : regExp},{desc : regExp}];

  }

	// 정렬 옵션
	var orderBy = {};
  // 1. 사용자 지정 정렬 옵션	
  var orderCondition = options.qs.order;
  if(orderCondition){
    orderBy[orderCondition] = -1;
  }
  // 2. 판매 시작일 내림차순(최근 쿠폰)	
  orderBy['saleDate.start'] = -1;
	// 3. 판매 종료일 오름차순(종료 임박 쿠폰)
  orderBy['saleDate.finish'] = 1;
	// 출력할 속성 목록
	var fields = {
		couponName: 1,
		image: 1,
		desc: 1,
		primeCost: 1,
		price: 1,
		useDate: 1,
		quantity: 1,
		buyQuantity: 1,
		saleDate: 1,
		position: 1
	};
	
  // TODO 전체 쿠폰 목록을 조회한다.

    var count = 0;
    var offset = 0;
    if(options.qs.page){
      count = 5;
      offset = (options.qs.page - 1) * count;
    }
    var cursor = db.coupon.find(query ,fields);
    cursor.count(function(err,totalcount){
      cursor.skip(offset).sort(orderBy).limit(count).toArray(function(err,result){
        clog.debug(result.length);
        result.totalPage = Math.floor((totalcount + count-1)/count);
        options.callback(result);
      });
    });
};

// 쿠폰 상세 조회
exports.couponDetail = function(io, _id, cb){
	// coupon, shop, epilogue 조인
  db.coupon.aggregate([{
    $match: {_id : new ObjectId(_id)}
  }, {
    // shop 조인
    $lookup: {
      from : 'shop',
      localField : 'shopId',  //coupon.shopId
      foreignField: '_id', // shop._id
      as: 'shop'
    }
  }, {
//  shop 조인한 결과 배열을 낱개의 속성으로 변환한다.
$unwind: '$shop'
  }, {
      // epilogue 조인
      $lookup: {
        from : 'epilogue',
        localField : '_id',  //coupon.shopId
        foreignField: 'couponId', // shop._id
        as: 'epilogueList'
      }
  }]).toArray(function(err, result){
    // result 가 배열로 넘어온다, 그중1개 만쓸 것이기에
    var coupon = result[0];
    clog.debug(coupon.length);
    // 뷰 카운트를 하나 증가시킨다.
    db.coupon.update({ _id : coupon._id },{$inc: {viewCount: 1}}, function(){
    // 웹소켓으로 수정된 조회수 top5를 전송한다.
    topCoupon('viewCount',function(result){
        io.emit('top5',result);
      });  
    });
    cb(coupon);
  });
};

// 구매 화면에 보여줄 쿠폰 정보 조회
exports.buyCouponForm = function(_id, cb){
	var fields = {
		couponName: 1,
    price: 1,
    quantity: 1,
    buyQuantity: 1,
    'image.detail': 1
	};
  // TODO 쿠폰 정보를 조회한다.
  db.coupon.findOne({_id : new ObjectId(_id)},fields,function(err,result){
    cb(result);
  });

};

// 쿠폰 구매
exports.buyCoupon = function(params, cb){
	// 구매 컬렉션에 저장할 형태의 데이터를 만든다.
	var document = {
		couponId: new ObjectId(params.couponId),
		email: params.userid,	// 나중에 로그인한 id로 대체
		quantity: parseInt(params.quantity),
		paymentInfo: {
			cardType: params.cardType,
			cardNumber: params.cardNumber,
			cardExpireDate: params.cardExpireYear + params.cardExpireMonth,
			csv: params.csv,
			price: parseInt(params.unitPrice) * parseInt(params.quantity)
		},
		regDate: MyUtil.getTime()
	};

	// TODO 구매 정보를 등록한다.
	 db.purchase.insert(document,function(err,result){
     if(err){
       clog.error(err);
       cb({message: '쿠폰 구매에실패했습니다. 잠시 후 다시 해보세요'})
     }else{
       // TODO 쿠폰 구매 건수를 하나 증가시킨다.
      db.coupon.update({ _id : document.couponId },{$inc: {buyQuantity: document.quantity}},function(){
        cb(null,document.couponId);
      });
     }
   });
  
};	
	
// 추천 쿠폰 조회
var topCoupon = exports.topCoupon = function(condition, cb){
  // 검색 조건
  var query = {};
  var now = MyUtil.getDay();
  
  // 1. 판매 시작일이 지난 쿠폰, 구매 가능 쿠폰(기본 검색조건)
  query['saleDate.start' ] = {$lte : now};
  query['saleDate.finish'] = {$gte : now};

  var order = {};
  order[condition] = -1; //-1 : desc , 1 : asc
  var fields = {couponName : 1};
  fields [condition] = 1;
  db.coupon.find(query,fields ).sort(order).limit(5).toArray(function(err,result){
    // clog.debug(condition, result);
    cb(result);
  });
};


// 지정한 쿠폰 아이디 목록을 받아서 남은 수량을 넘겨준다.
exports.couponQuantity = function(coupons, cb){
  coupons = coupons.map(function(couponId){
    return ObjectId(couponId);
  });
  db.coupon.find({_id: {$in: coupons}},{quantity:1 , buyQuantity:1}).toArray(function(err, result){
    // clog.error(coupons,result);
    cb(result);
  });
};

// 임시로 저장한 프로필 이미지를 회원 이미지로 변경한다.
function saveImage(tmpFileName, profileImage){
	var tmpDir      = path.join(__dirname, '..', 'public', 'tmp');
	var profileDir  = path.join(__dirname, '..', 'public', 'image', 'member');
  // TODO 임시 이미지를 member 폴더로 이동시킨다.
  fs.rename(
    path.join(tmpDir,tmpFileName),
    path.join(profileDir,profileImage)
    ,function(err,result){
      clog.debug(err,result);
    });
}

// 회원 가입
exports.registMember = function(params, cb){
	var member = {
    _id : params._id,
    password: params.password,
    profileImage: params._id,
    regDate: MyUtil.getTime()
  };
  db.member.insert(member, function(err,result){
    if(err && err.code == 11000){ //아이디 중복 오류
      err = {message: '이미 등록된 이메일입니다.'};
    }else{
      saveImage(params.tmpFileName, member.profileImage);
    }
    cb(err, result);
  });
};

// 로그인 처리
exports.login = function(params, cb){
	// TODO 지정한 아이디와 비밀번호로 회원 정보를 조회한다.
	db.member.findOne(params,{profileImage:1} , function(err,result){
    if(!result)
    {
      err = {message: '아이디와 비밀번호를 확인하시기 바랍니다.'};
    }
    cb(err,result);
  });
};

// 회원 정보 조회
exports.getMember = function(userid, cb){
  db.purchase.aggregate([
    {$match: {email: userid}},
    {$lookup: {
        from: 'coupon',
        localField: 'couponId',
        foreignField: '_id',
        as: 'coupon'
    }},
    {$unwind: '$coupon'},
    {$lookup: {
        from: 'epilogue',
        localField: 'epilogueId',
        foreignField: '_id',
        as: 'epilogue'
    }},
    {$unwind: {
        path: '$epilogue',
        preserveNullAndEmptyArrays: true
    }},
    {$project: {
        _id: 1,
        couponId: 1, 
        regDate: 1,
        'coupon.couponName': '$coupon.couponName',
        'coupon.image.main': '$coupon.image.main',
        epilogue: 1
    }},
    {$sort: {regDate: -1}}
  ]).toArray(function(err, result){
    cb(result);
  });
};

// 회원 정보 수정
exports.updateMember = function(userid, params, cb){
  var oldPassword = params.oldPassword;
  // 이전 비밀번호로 회원 정보를 조회한다.
  db.member.findOne({_id: userid, password: oldPassword}, function(err, member){
    if(!member){
      err = {message: '이전 비밀번호가 맞지 않습니다.'};
      cb(err);
    }else{
      // 비밀번호 수정일 경우
      if(params.password.trim() != ''){
        member.password = params.password;
      }
      var tmpFileName = params.tmpFileName;
      // 프로필 이미지를 수정할 경우
      if(tmpFileName){
        // 프로필 이미지 파일명을 회원아이디로 지정한다.
        member.profileImage = member._id;
        saveImage(tmpFileName, member.profileImage);  
      }
      // 회원 정보를 수정한다.
      db.member.update({_id: userid}, member, function(err, result){
        cb(err, result);
      });
    }
  });
};


// 쿠폰 후기 등록
exports.insertEpilogue = function(userid, params, cb){
	var purchaseId = ObjectId(params.purchaseId);
  delete params.purchaseId;
  var epilogue = params;
  epilogue._id = ObjectId();
  epilogue.regDate = MyUtil.getDay();
  epilogue.couponId = ObjectId(params.couponId);
  epilogue.writer = userid;
  db.epilogue.insert(epilogue, function(err, result){
    if(err){
      cb({message: '후기 등록에 실패했습니다. 잠시후 다시 이용해 주시기 바랍니다.'});
    }else{
      // 구매 컬렉션에 후기 아이디를 등록한다.
      db.purchase.update({_id: purchaseId}, {$set: {epilogueId: epilogue._id}}, function(err, result){
        if(err){
          cb({message: '후기 등록에 실패했습니다. 잠시후 다시 이용해 주시기 바랍니다.'});
        }else{
          // 쿠폰 컬렉션의 후기 수와 만족도 합계를 업데이트 한다.
          db.coupon.findOne({_id: epilogue.couponId}
                  , {epilogueCount: 1, satisfactionAvg: 1}, function(err, coupon){
            var query = {
              $inc: {epilogueCount: 1},
              $set: {satisfactionAvg: (coupon.satisfactionAvg * coupon.epilogueCount + parseInt(epilogue.satisfaction)) / (coupon.epilogueCount+1)}
            };
            db.coupon.update({_id: epilogue.couponId}, query, function(){
              cb();
            });
          });
        }
      });
    }    
  });
};