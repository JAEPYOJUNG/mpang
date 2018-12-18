var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/today');
});

router.get('/today', function(req, res, next) {
  res.render('today', { title: '오늘의 메뉴x' });
});

router.get('/detail', function(req, res, next) {
  res.render('detail', { title: '디저트 마카롱' });
});


router.get('/location', function(req, res, next) {
  res.render('location', { title: '근처 쿠폰' });
});

router.get('/best', function(req, res, next) {
  res.render('best', { title: '추천 쿠폰' });
});

router.get('/all', function(req, res, next) {
  res.render('all', { title: '모든 쿠폰' });
});

module.exports = router;
