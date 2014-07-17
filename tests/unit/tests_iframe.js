
QUnit.test( "Dropkick closes from click event in parent document when running inside an iframe", 2, function( assert ) { 
  var dk = new Dropkick("#normal_select");
  dk.open();
  assert.notEqual(dk.isOpen, false);
    var evt = document.createEvent("MouseEvents");
    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0,
        false, false, false, false, 0, null);
	parent.document.dispatchEvent(evt);
  assert.equal(dk.isOpen, false);
});
