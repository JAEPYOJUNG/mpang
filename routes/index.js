var express = require('express');
var router = express.Router();
var model = require('../model/mulpangDao');
var MyUtil = require('../utils/myutil');
var checklogin = require('../middleware/checklogin');

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
router.get('/purchase/:no', checklogin , function(req, res, next){
  model.buyCouponForm(req.params.no, function(coupon){
    res.render('buy', {
      title: coupon.couponName, 
      coupon: coupon,
      css: 'detail.css',
      js: 'buy.js'
    });
  });
});

router.post('/purchase', checklogin , function(req, res, next){
  req.body.userid = req.session.user._id;
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
      res.locals.list =list;
      res.locals.query= req.query;
      res.render('all', {
        title: '모든 쿠폰', 
        css: 'all.css',
        // list:list,  //위에 res.locals.list 로선언해도된다
        // query: req.query
      });  
    }
  });

});
router.get('/couponQuantity', function(req, res, next){
  model.couponQuantity(req.query.couponIdList.split(','), function(result){
    res.contentType('text/event-stream');
    res.write('data:' + JSON.stringify(result) + '\n');
    res.write('\n');
    res.end('retry:' + 1000*10 + '\n');
  });
});

module.exports = router;
