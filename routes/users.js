var express = require('express');
var router = express.Router();
var model = require('../model/mulpangDao');
var MyUtil = require('../utils/myutil');

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
  res.json({_id: 'uzoolove@gmail.com', profileImage: 'uzoolove@gmail.com'});
});
router.get('/logout', function(req, res, next) {
  res.redirect('/');
});
router.get('/login', function(req, res, next) {
  res.render('login', {title: '로그인'});
});
router.post('/login', function(req, res, next) {
  res.redirect('/');
});
router.get('/', function(req, res, next) {
  res.render('mypage', {title: '마이페이지', css: 'mypage.css', js: 'mypage.js'});
});
router.put('/', function(req, res, next) {
  res.end('success');
});
router.post('/epilogue', function(req, res, next) {
  res.end('success');
});

module.exports = router;
