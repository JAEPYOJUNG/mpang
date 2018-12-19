$(function(){
	setCancelEvent();
	setBuyEvent();
	setPriceEvent();	
});

// 취소 버튼 클릭
function setCancelEvent(){
	$('form button[type=reset]').click(function(){
    window.history.back();
  });
}

// 구매 버튼 클릭
function setBuyEvent(){
	$('.detail form').submit(function(){
    var body = $(this).serialize(); //form 및의 모든요소를 submit 때 모두 묶어서줌

    $.ajax('/purchase',{
      method: 'post',
      data: body,
      success: function(result){
        if(result.errors){
          alert(result.errors.message);
        }else{
           alert('쿠폰 구매가 완료되었습니다.');
           location.href = location.href.replace('purchase','coupons');
        }
      }
    });
    return false; //submit 취소
  });
}

// 구매수량 수정시 결제가격 계산
function setPriceEvent(){
  $('.detail form input[name=quantity]').bind('input',function(){
    $('form output').text($(this).val() * $('form input[name=unitPrice]').val());
  });
}