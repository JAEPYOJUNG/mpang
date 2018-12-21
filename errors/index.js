const MyError = {
  FAIL: 100,
  LOGIN_FAIL: 101,
  PASSWORD_INCRRECT: 102,
  USER_DUPLICATE: 103,
  LOGIN_NEED: 104,
  Message: {
    100: '작업 처리에 실패했습니다. 잠시후 다시 이용해 주시기 바랍니다.',
    101: '아이디와 비밀번호를 확인하시기 바랍니다.',
    102: '이전 비밀번호가 맞지 않습니다.',
    103: '이미 등록된 이메일입니다.',
    104: '로그인이 필요한 서비스입니다.'
  },
  Status: {
    100: 500, // internal server errer
    101: 401, // Unauthorized
    102: 401,
    103: 409, // Conflict
    104: 401
  },
  getError: function(code, location){
    return {
      type: 'custom',
      code: code,
      message: MyError.Message[code],
      status: MyError.Status[code],
      location: location
    };
  }
};

module.exports = MyError;