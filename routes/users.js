var express = require('express');
var router = express.Router();
var model = require('../model/mulpangDao');
var MyUtil = require('../utils/myutil');

router.get('/new', function(req, res, next) {
  res.render('join', {title: '회원 가입', js: 'join.js'});
});
router.post('/profileUpload', function(req, res, next) {
  res.end('tmpfile.png');   // 임시 파일명 응답
});
router.post('/new', function(req, res, next) {
  res.end('success');
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
