var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var util = require('util');
var path = require('path');
var clog = require('clog');
var fs = require('fs');

// DB 접속
var db;
MongoClient.connect('mongodb://localhost:27017', function(err, client){
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
	// 검색 조건
	var query = {};
	// 1. 판매 시작일이 지난 쿠폰, 구매 가능 쿠폰(기본 검색조건)	
	// 2. 구매가능/지난쿠폰/전체	
	// 3. 지역명	
	// 4. 검색어	

	// 정렬 옵션
	var orderBy = {};
	// 1. 사용자 지정 정렬 옵션	
	// 2. 판매 시작일 내림차순(최근 쿠폰)	
	// 3. 판매 종료일 오름차순(종료 임박 쿠폰)

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
    var count = 5;
    db.coupon.find(query ,fields).limit(count).toArray(function(err,result){
      clog.debug(result);
      options.callback(result);
    });
};

// 쿠폰 상세 조회
exports.couponDetail = function(_id, cb){
	// coupon, shop, epilogue 조인
	
	// 뷰 카운트를 하나 증가시킨다.
	
	// 웹소켓으로 수정된 조회수 top5를 전송한다.
	

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

};

// 쿠폰 구매
exports.buyCoupon = function(params, cb){
	// 구매 컬렉션에 저장할 형태의 데이터를 만든다.
	var document = {
		couponId: new ObjectId(params.couponId),
		email: 'uzoolove@gmail.com',	// 나중에 로그인한 id로 대체
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
	
	// TODO 쿠폰 구매 건수를 하나 증가시킨다.
	
};	
	
// 추천 쿠폰 조회
var topCoupon = exports.topCoupon = function(condition, cb){
	
};

// 지정한 쿠폰 아이디 목록을 받아서 남은 수량을 넘겨준다.
exports.couponQuantity = function(coupons, cb){

};

// 임시로 저장한 프로필 이미지를 회원 이미지로 변경한다.
function saveImage(tmpFileName, profileImage){
	var tmpDir = path.join(__dirname, '..', 'public', 'tmp');
	var profileDir = path.join(__dirname, '..', 'public', 'image', 'member');
	// TODO 임시 이미지를 member 폴더로 이동시킨다.
	
}

// 회원 가입
exports.registMember = function(params, cb){
	
};

// 로그인 처리
exports.login = function(params, cb){
	// TODO 지정한 아이디와 비밀번호로 회원 정보를 조회한다.
	
};

// 회원 정보 조회
exports.getMember = function(userid, cb){
	
};

// 회원 정보 수정
exports.updateMember = function(userid, params, cb){
	
};

// 쿠폰 후기 등록
exports.insertEpilogue = function(userid, params, cb){
	
};