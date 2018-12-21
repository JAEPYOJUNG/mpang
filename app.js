var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var skiplog = {
  '.gif':1,
  '.jpg':1,
  '.png':1,
  '.svg':1,
  '.css':1,
  '.js':1,
  '.ttf':1,
  '.woof':1,
  '.ico':1
}
app.use(logger('dev',{skip : function(req){
  return skiplog[path.extname(req.url)];
}}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req , res , next ){
  // 1. req , res , next를 매개변수로 정의한다
  // 2. 미들웨어가 처리할 작업을 수행한 후 
  // 응답을 완료하거나 (res) <- 응답이란 response를 내보내고 끝나는것을 의미한다.
  // 다음 미들웨어를 호출한다. (next())
  console.log('----before----');
  // console.log('headers:', req.headers);
  console.log('cookies:',req.cookies);
  console.log('session:',req.session);
  next();
});


//static 모듈과 라우터 중간쯤에 세션을 쓰는게 정석!
// SSE (server side events)의 방지법 "/couponQuantity"로 시작하지 않는 url에 세션 사용
app.use(/^((?!\/couponQuantity).)*$/, session({
  cookie: {maxAge: 1000*60*30},// 1000ms * * 
  secret: 'some seed text',
  rolling: true,  // 매 요청마다 세션 갱신
  resave: false,   // 세션이 수정되지 않으면 서버에 다시 저장하지 않음
  saveUninitialized: false  // 세션에 아무 값도 지정되지 않으면 클라이언트에 전송안함
}), function(req, res, next){
  // ejs 렌더링에 사용할 변수 지정
  res.locals.user = req.session.user;
  next();
});

app.use(function(req , res , next ){
  // 1. req , res , next를 매개변수로 정의한다
  // 2. 미들웨어가 처리할 작업을 수행한 후 
  // 응답을 완료하거나 (res) <- 응답이란 response를 내보내고 끝나는것을 의미한다.
  // 다음 미들웨어를 호출한다. (next())
  console.log('----after----');
  // console.log('headers:', req.headers);
  console.log('cookies:',req.cookies);
  console.log('session:',req.session);
  next();
});


app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404, req.url + ' NotFound'));
});


// error handler
app.use(function(err, req, res, next) {
  console.error(err.stack);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
