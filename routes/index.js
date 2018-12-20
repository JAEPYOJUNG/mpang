var express = require('express');
var router = express.Router();
var model = require('../model/mulpangDao');
var MyUtil = require('../utils/myutil');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/today');
});
router.get('/today', function(req, res, next) {
  if(req.query.page){
    req.query.page = parseInt(req.query.page);
  }else{
    req.query.page = 1;
    if(req.query.date){
      req.url += '&page=1';
    }else{
      req.url += '?page=1';
    }
  }
  model.couponList({
    qs: req.query,  //주소창의 쿼리스트링(url뒷부분)
    callback: function(list){
      list.page = {};
      if(req.query.page > 1){
        list.page.pre = req.url.replace(`page=${req.query.page}`, `page=${req.query.page-1}`);
      }
      if(req.query.page < list.totalPage){
        list.page.next = req.url.replace(`page=${req.query.page}`, `page=${req.query.page+1}`);
      }
      res.render('today', { 
        title: '오늘의 메뉴', 
        list: list,
        css: 'today.css',
        query: req.query,
        today:MyUtil.getDay(),
        now:MyUtil.getTime()
      });
    }
  });
});
router.get('/coupons/:no', function(req, res, next) {
  var couponId = req.params.no;
  var socketio =req.app.get('io');

  model.couponDetail(socketio , couponId, function(coupon){
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
      res.render('location', {
        title: '근처 쿠폰',
        list: list , 
        css: 'location.css', 
        js:  'location.js'
      });  
    }
  });
  
});
router.get('/best', function(req, res, next){
  res.render('best', {title: '추천 쿠폰', css: 'best.css', js: 'best.js'});  
});

router.get('/topCoupon', function(req, res, next){
 model.topCoupon(req.query.condition, function(list){
   res.json(list);
 });
});
 
router.get('/all', function(req, res, next){
  model.couponList({
    qs: req.query,  //주소창의 쿼리스트링(url뒷부분)
    callback: function(list){
      res.render('all', {
        title: '모든 쿠폰', 
        css: 'all.css',
        list:list, 
        query: req.query
      });  
    }
  });

});
router.get('/couponQuantity', function(req, res, next){
  res.end('success');
});

module.exports = router;
