QUnit.test( "Dropkick methods should still work when not rendered on mobile", 3, function( assert ) {
  var $sel = $("#normal_select"),
    dk = new Dropkick($sel[0]);

  assert.equal(navigator.userAgent, "Android");

  assert.notEqual($sel.attr("data-dkCacheId"), dk.data.cacheID + '');

  dk.select(2); //2 = Alaska

  assert.equal($sel.val(), dk.value);
});
