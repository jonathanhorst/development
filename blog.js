$(document).ready(function() {
  var navigation = $('[role="navigation"]');
  var list = $('[role="list"]');

  if (list.children().length <= 25) {
    navigation.addClass("hide");
  }
});
