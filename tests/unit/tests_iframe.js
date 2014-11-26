// #TODO: this test fails because of the changes made to onDocClick.
QUnit.test( "Dropkick closes from click event in parent document when running inside an iframe", function( assert ) {
  var dk = new Dropkick("#normal_select");
  var evt = document.createEvent("MouseEvents");

  dk.open();
  assert.notEqual(dk.isOpen, false);

  evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	parent.document.dispatchEvent(evt);

  assert.equal(dk.isOpen, false);
});
