$(document).ready(function() {
  var list = $('[role="list"]');
  list.each(function() {
    var navigation = $(this).siblings('[role="navigation"]');
    if ($(this).children().length <= 25) {
      navigation.addClass("hide");
    }
  });
});