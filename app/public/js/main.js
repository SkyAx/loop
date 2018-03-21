$(document).ready(function (e) {
  $('.offers-item').on('click', function (e) {
    $(this).toggleClass('active');
  });

  $('.budget-count').text($("[type=range]").val() + " $")

  $("[type=range]").on('change mousemove', function(){
    var newv=$(this).val();
    if(newv == 30000){
      $('.budget-count').text('50000$+');
    } else if(newv == 500) {
      $('.budget-count').text('менее 500$')
    } else {
      $('.budget-count').text(newv + " $")
    }
  });

  var mySwiper = new Swiper('.swiper-container', {
      speed: 400,
      pagination: '.swiper-pagination',
      paginationClickable: true
  });
});
