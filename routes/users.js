var express = require('express');
var router = express.Router();
var model = require('../model/mulpangDao');
var MyUtil = require('../utils/myutil');
var checklogin = require('../middleware/checklogin');


router.get('/new', function(req, res, next) {
  res.render('join', {title: '회원 가입', js: 'join.js'});
});

var path = require('path');
var tmp = path.join(__dirname , '..' , 'public','tmp');
var multer = require('multer');
router.post('/profileUpload', multer({dest: tmp}).single('profile'), function(req, res, next) {
  console.log(req.file);
  res.end(req.file.filename);
});

router.post('/new', function(req, res, next) {
  model.registMember(req.body, function(err,result){
    if(err){
      res.json({errors: err});
    }else{
      res.end('success');
    }
  });
});

router.post('/simpleLogin', function(req, res, next) {
  model.login(req.body, function(err,result){
    if(err){
      res.json({errors: err});
    }else{
      req.session.user = result;
      res.json(result);
    } 
  });
});

router.get('/logout', function(req, res, next) {
  req.session.destroy();
  res.redirect('/');
});
router.get('/login', function(req, res, next) {
  res.render('login', {title: '로그인'});
});
router.post('/login', function(req, res, next) {
  model.login(req.body,function(err,result){
    if(err){
      res.render('login',{title:'로그인', errors : err});
    }else{
      req.session.user = result;
      res.redirect(req.session.backUrl || '/');
    }
  });
});
router.get('/', checklogin ,  function(req, res, next) {
  var userid = req.session.user._id;
  model.getMember(userid,function(result){
    res.render('mypage', {
      title: '마이페이지', 
      css: 'mypage.css', 
      js: 'mypage.js',
      purchases: result,
      toStar: MyUtil.toStar
    });
  });
  
});
router.put('/', checklogin , function(req, res, next) {
  var userid = req.session.user._id;
  model.updateMember(userid,req.body, function(err,result){
    if(err){
      res.json({errors: err});
    }else{
      res.end('success');
    }
  });
});
router.post('/epilogue', checklogin , function(req, res, next) {
  var userid = req.session.user._id;
  model.insertEpilogue(userid,req.body,function(){
    res.end('success');
  });
});

module.exports = router;
