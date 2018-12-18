var express = require('express');
var router = express.Router();
var model = require('../model/mulpangDao');
var MyUtil = require('../utils/myutil');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/today');
});

router.get('/today', function(req, res, next){
  model.couponList({
    callback: function(list){
      res.render('today', { title: '오늘의 메뉴x', list: list });
    }
  });
});

router.get('/coupons/:no', function(req, res, next) {
  var couponId = req.params.no;
  model.couponDetail(couponId,function(coupon){
    res.render('detail', { title: '디저트 마카롱', coupon:coupon ,toStar: MyUtil.toStar});
  });
});

router.get('/purchase/:no',function(req,res,next){
  model.buyCouponForm(req.param.no, function(coupon){
    res.render('buy',{title: '디저트 마카롱',coupon:coupon})
  });
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
