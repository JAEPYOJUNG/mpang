var express = require('express');
var router = express.Router();
var model = require('../model/mulpangDao');
var MyUtil = require('../utils/myutil');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/today');
});
router.get('/today', function(req, res, next) {
  model.couponList({
    callback: function(list){
      res.render('today', { 
        title: '오늘의 메뉴', 
        list: list,
        css: 'today.css',
        today:MyUtil.getDay(),
        now:MyUtil.getTime()
      });
    }
  });
});
router.get('/coupons/:no', function(req, res, next) {
  var couponId = req.params.no;
  model.couponDetail(couponId, function(coupon){
    res.render('detail', {
      title: coupon.couponName, 
      coupon: coupon, 
      toStar: MyUtil.toStar,
      css: 'detail.css',
      js: 'detail.js'
    });
  });
});
router.get('/purchase/:no', function(req, res, next){
  model.buyCouponForm(req.params.no, function(coupon){
    res.render('buy', {
      title: coupon.couponName, 
      coupon: coupon,
      css: 'detail.css',
      js: 'buy.js'
    });
  });
});
router.post('/purchase', function(req, res, next){
  model.buyCoupon(req.body, function(err, result){
    if(err){
      res.json({errors: err});
      // var result = JSON.stringify({errors: err});
      // res.end(result);
    }else{
      res.end('OK');
    }
  });
});
router.get('/location', function(req, res, next){
  model.couponList({
    callback: function(list){
      res.render('location', {title: '근처 쿠폰',list: list , css: 'location.css', js: 'location.js'});  
    }
  });
  
});
router.get('/best', function(req, res, next){
  res.render('best', {title: '추천 쿠폰', css: 'best.css', js: 'best.js'});  
});
router.get('/topCoupon', function(req, res, next){
  res.json([]);
});
router.get('/all', function(req, res, next){
  res.render('all', {title: '모든 쿠폰', css: 'all.css'});  
});
router.get('/couponQuantity', function(req, res, next){
  res.end('success');
});

module.exports = router;
