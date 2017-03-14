$(function(){
    var CURRENT_CART = 1,
        CART_LENGTH = $('.flip-container').length;
   $('.flip-container').click(function(){
      $(this).toggleClass('hover');
   });
    
   $('.flip-list a').click(function(e){
       e.preventDefault();
       if($(this).hasClass('next'))
           CURRENT_CART = (CURRENT_CART<CART_LENGTH)?CURRENT_CART+1:CURRENT_CART;
       else
           CURRENT_CART = (CURRENT_CART-1>0)?CURRENT_CART-1:CURRENT_CART;
       $('.flip-list span').text(CURRENT_CART);
       $('.flip-container.active').removeClass('active hover');
       $('.flip-container[data-id='+CURRENT_CART+']').addClass('active');
   }); 
});