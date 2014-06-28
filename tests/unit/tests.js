QUnit.test( "Create a new Dropkick", 3, function( assert ) {
  var dk = new Dropkick("#normal_select");
  assert.equal(dk.length, 52);
  assert.equal(dk.data.select.id, "normal_select");
  assert.equal(dk.data.select.getAttribute("data-dkcacheid"), "0");
});

QUnit.test( "Dropkick opens", 1, function( assert ) {
  var dk = new Dropkick("#normal_select");
  dk.open();
  assert.equal(dk.isOpen, true);
});

QUnit.test( "Dropkick closes", 1, function( assert ) {
  var dk = new Dropkick("#normal_select");
  dk.open();
  dk.close();
  assert.equal(dk.isOpen, false);
});

QUnit.test( "Dropkick selects an option", 2, function( assert ) {
  var dk = new Dropkick("#normal_select");
  assert.equal(dk.select(4), dk.item(4));
  assert.equal(dk.item(4).classList.contains("dk-option-selected"), true);
});

QUnit.test( "Dropkick searches Alabama and returns Alabama", function( assert ) {
  var dk = new Dropkick("#normal_select");
  assert.equal(dk.search("Alabama")[0], dk.item(1));
});
