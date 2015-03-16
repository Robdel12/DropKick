$(document).ready(function() {
  $(".tabs a").click(function(event) {
    event.preventDefault();

    $(this).parent().addClass("current");
    $(this).parent().siblings().removeClass("current");
    var tab = $(this).attr("href");
    $(".tab-content").not(tab).css("display", "none");
    $(tab).show();
  });
});
