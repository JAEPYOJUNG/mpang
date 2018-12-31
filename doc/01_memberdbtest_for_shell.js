import { get } from "http";

db
use
// 현재 DB 삭제
db.runCommand({dropDatabase: 1});

// 등록할 회원 정보
var m1 = {name: "kim", age: 20};
var m2 = {name: "lee", age: 20};
var m3 = {name: "admin", age: 35};

// TODO 1. member 컬렉션에 데이터 등록
// insert({등록할 문서})
db.member.insert(m1);   //하나만 insert할떄
db.member.insert([m2,m3]); //여러개 insert할때 는 배열로 []


// TODO 2. member 컬렉션 조회
// find()
db.member.find();


// TODO 3. 회원 조회(나이가 20인 회원 조회)
// find({검색조건})
db.member.find({age : 20});
db.member.find({ name : "kim"});
db.member.find({ name : "kim" , age : 20 });

db.member.find({age: {$gte : 20}});
// $gt $gte $lt $lte

// TODO 4. 회원 조회(1건)
// findOne()
db.member.findOne();  //rownum = 1 , id 값 작은걸로하여금 먼저나옴
db.member.findOne({age:20});

// TODO 5. 회원 수정(kim의 나이 수정)
// update({검색조건}, {수정할 문서})
// 지정한 문서 전체를 수정
db.member.update({name:"kim"},{age:25}); //주의, kim을 찾아서 통째로교체 , find & delete & insert
// { "_id" : ObjectId("5c1855799a1eef73f453b419"), "name" : "kim", "age" : 20 } 가
// { "_id" : ObjectId("5c1855799a1eef73f453b419"), "age" : 25 } 이렇게 바껴버린다

// 지정한 속성만 수정할 경우
db.memeber.update({name : 'lee'},{$set:{age:25}});

// 지정한 속성을 증가시킬 경우
db.member.update({name:"lee"},{$inc:{age:1}});

// TODO 6. lee 삭제
// remove({검색 조건})
db.member.remove({name:"lee"});


db.coupon.update({"couponName" : "물냉면" },{ $set:{"saleDate.finish" : "2019-02-02" }})

db.coupon.update({"couponName" : "눈물의 해물 파전" },{ $set:{"saleDate.finish" : "2019-02-02" }})








