//Private tests functions
_ = {
  hasClass: function( elem, classname ) {
    var reg = new RegExp( "(^|\\s+)" + classname + "(\\s+|$)" );
    return elem && reg.test( elem.className );
  }
};

QUnit.test( "Create a new Dropkick", 3, function( assert ) {
  var dk = new Dropkick("#normal_select"),
      currentDkCacheID = dk.data.cacheID;

  assert.equal(dk.length, 52);
  assert.equal(dk.data.select.id, "normal_select");
  assert.equal(dk.data.select.getAttribute("data-dkcacheid"), currentDkCacheID);
});

QUnit.test( "Dropkick should be cached", 2, function( assert ) {
  var dk = new Dropkick("#normal_select"),
    currentDkCacheID = dk.data.cacheID;

  // uid is always one more than the last id
  assert.equal(Dropkick.uid - 1, currentDkCacheID);

  dk = new Dropkick("#normal_select");

  assert.equal(Dropkick.uid - 1, currentDkCacheID);
});

QUnit.test( "Dropkick opens", 1, function( assert ) {
  var dk = new Dropkick("#normal_select", {
    open: function() {
      assert.equal(this.isOpen, true);
    }
  });

  QUnit.stop();
  dk.open();
  QUnit.start();
});

QUnit.test( "Dropkick opens from external button", 1, function( assert ) {
  var dk = new Dropkick("#normal_select", {
    open: function() {
      assert.equal(this.isOpen, true);
    }
  });

  $("#btn").on("click", function(){
    dk.open();
  });

  QUnit.stop();
  $("#btn").trigger("click");
  QUnit.start();
});


QUnit.test( "Dropkick closes", 2, function( assert ) {
  var dk = new Dropkick("#normal_select", {
    open: function() {
      assert.notEqual(this.isOpen, false);

      // wait until after we're open to close
      dk.close();
      assert.equal(dk.isOpen, false);
    }
  });

  QUnit.stop();
  dk.open();
  QUnit.start();
});

QUnit.test( "Dropkick selects an option", 4, function( assert ) {
  var dk = new Dropkick("#normal_select");

  assert.equal(dk.select(4), dk.item(4));
  assert.equal(_.hasClass(dk.item(4), "dk-option-selected"), true);
  assert.equal(dk.select(4), dk.selectedOptions[0]);
  assert.equal(dk.selectedIndex, 4);
});

QUnit.test( "Dropkick searches Alabama and returns Alabama", 1, function( assert ) {
  var dk = new Dropkick("#normal_select");

  assert.equal(dk.search("Alabama")[0], dk.item(1));
});

QUnit.test( "Adds an option to the select", 1, function( assert ) {
  var dk = new Dropkick("#normal_select");
  dk.add("This is an option", 5);

  assert.equal(dk.item(5).innerHTML, "This is an option");
});

QUnit.test( "Remove an option from the select", 1, function( assert ) {
  var dk = new Dropkick("#normal_select");
  dk.remove(2); //2 = Alaska

  assert.notEqual(dk.item(2).innerHTML, "Alaska");
});

QUnit.test( "Disable the entire select", 1, function( assert ) {
  var dk = new Dropkick("#normal_select");
  dk.disable();

  assert.equal(dk.disabled, true);
});

QUnit.test( "Disable the one option in the select", 1, function( assert ) {
  var dk = new Dropkick("#normal_select");
  dk.disable(2); //2 = Alaska

  assert.equal(_.hasClass(dk.item(2), "dk-option-disabled"), true);
});

QUnit.test( "Reset the selection", 2, function( assert ) {
  var dk = new Dropkick("#normal_select");
  dk.select(2); //2 = Alaska

  assert.equal(dk.selectedIndex, 2); //Make sure we're really selected on the second index
  dk.reset();
  assert.equal(dk.selectedIndex, 0);
});

QUnit.test( "Dropkick returns the proper selected value", 1, function( assert ) {
  var dk = new Dropkick("#normal_select");
  dk.select(2); //2 = Alaska

  assert.equal(dk.value, "AK"); //Make sure we're really selected on the second index
});

QUnit.test( "Update the length properly", 1, function( assert ) {
  var dk = new Dropkick("#normal_select");
  while(dk.length > 49) dk.remove(1);

  assert.equal(dk.length, 49);
});

QUnit.test( "Checks if multi select is true", 1, function( assert ) {
  var dk_multi = new Dropkick("#multiple");

  assert.equal(dk_multi.multiple, true);
});

QUnit.test( "Dispose should remove dropkick from cache", 2, function( assert ) {
  var dk = new Dropkick("#normal_select");

  assert.ok(Dropkick.cache[dk.data.cacheID] === dk);

  dk.dispose();

  assert.ok(Dropkick.cache[dk.data.cacheID] === undefined);
});
