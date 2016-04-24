QUnit.test( "Dropkick methods should still work when not rendered on mobile", 3, function( assert ) {
  var $sel = $("#normal_select"),
    dk = new Dropkick($sel[0]);

  assert.equal(navigator.userAgent, "Android");

  assert.notEqual($sel.attr("data-dkCacheId"), dk.data.cacheID + '');

  dk.select(2); //2 = Alaska
  dk.refresh();

  assert.equal($sel.val(), dk.value);
});

QUnit.test( "Dropkick shouldn't blow up when calling methods on mobile: false dks", 1, function( assert ) {
  var $sel = $("#normal_select", {mobile: false}),
      dk = new Dropkick($sel[0]);

  assert.equal(navigator.userAgent, "Android");

  dk.refresh();
});
