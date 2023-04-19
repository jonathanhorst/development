$(document).ready(function() {
  var defaultValue = $("#organization-type").attr("th-default");

  if (defaultValue) {
    console.log("th-default value: " + defaultValue);
    $("#organization-type").val(defaultValue);
    $("#organization-type option[value='']").remove();
  }
});