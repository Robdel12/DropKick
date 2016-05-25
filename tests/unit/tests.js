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

QUnit.test( "Strict searches Alabama and returns Alabama", 2, function( assert ) {
  var dk = new Dropkick("#normal_select");

  assert.equal(dk.search("Alabama").length, 1);
  assert.equal(dk.search("Alabama")[0], dk.item(1));
});

QUnit.test( "Fuzzy searches ac and returns an array of two", 3, function( assert ) {
  var dk = new Dropkick("#normal_select");

  assert.equal(dk.search("ac", "fuzzy").length, 1, "Nothing returned in search");
  assert.equal(dk.search("ac", "fuzzy")[0], dk.item(22), "Didn't find 'Massachusetts' in search");
  assert.deepEqual(dk.search("ac"), [], "Should return an empty array");
});

QUnit.test( "Partial searches mo and returns an array of two", 3, function( assert ) {
  var dk = new Dropkick("#normal_select");

  assert.equal(dk.search("mo", "partial").length, 2);
  assert.equal(dk.search("mo", "partial")[0], dk.item(27));
  assert.equal(dk.search("mo", "partial")[1], dk.item(46));
});

QUnit.test( "Adds an option to the select", 2, function( assert ) {
  var dk = new Dropkick("#normal_select");
  dk.add("This is an option", 5);

  assert.equal(dk.item(5).innerHTML, "This is an option");

  dk.add("This is another option");

  assert.equal(dk.item(dk.options.length - 1).innerHTML, "This is another option");
});

QUnit.test( "Remove an option from the select", 1, function( assert ) {
  var dk = new Dropkick("#normal_select");
  dk.remove(2); //2 = Alaska

  assert.notEqual(dk.item(2).innerHTML, "Alaska");
});

QUnit.test( "Disable the entire select", 2, function( assert ) {
  var dk = new Dropkick("#normal_select");
  dk.disable();

  assert.equal(dk.disabled, true);
  assert.equal(dk.data.elem.hasAttribute('aria-disabled', true), true);
});

QUnit.test( "Enable the entire select", 2, function( assert ) {
  var dk = new Dropkick("#normal_select");
  dk.disable();
  //reenable
  dk.disable(false);

  assert.equal(dk.disabled, false);
  assert.equal(dk.data.elem.hasAttribute('aria-disabled', false), true);
});

QUnit.test( "Disable the one option in the select", 2, function( assert ) {
  var dk = new Dropkick("#normal_select");
  dk.disable(2); //2 = Alaska

  assert.equal(_.hasClass(dk.item(2), "dk-option-disabled"), true);
  assert.equal(dk.item(2).hasAttribute('aria-disabled', true), true);
});

QUnit.test( "Enable the one option in the select", 2, function( assert ) {
  var dk = new Dropkick("#normal_select");
  dk.disable(2); //2 = Alaska
  //reenable
  dk.disable(2, false); //2 = Alaska

  assert.equal(_.hasClass(dk.item(2), "dk-option-disabled"), false);
  assert.equal(dk.item(2).hasAttribute('aria-disabled', false), true);
});

QUnit.test( "Hide the one option in the select", 2, function ( assert ) {
  var dk = new Dropkick('#normal_select');
  dk.hide(2); // 2 = Alaska

  assert.equal(_.hasClass(dk.item(2), "dk-option-hidden"), true);
  assert.equal(dk.item(2).hasAttribute('aria-hidden', true), true);
});

QUnit.test( "Show the one option in the select", 2, function ( assert ) {
  var dk = new Dropkick('#normal_select');
  dk.hide(2); // 2 = Alaska
  // Show the option again
  dk.hide(2, false);
  
  assert.equal(_.hasClass(dk.item(2), "dk-option-hidden"), false);
  assert.equal(dk.item(2).hasAttribute('aria-hidden', false), true);
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

QUnit.test( "Dropkick options should return an array", 2, function( assert ) {
  var dk = new Dropkick("#normal_select");

  assert.equal(dk.options.length, 52, "Didn't return the full list of options");
  assert.ok(dk.options instanceof Array, "Options are not an array");
});

QUnit.test( "Dropkick refresh should work", 5, function( assert ) {
  var dk = new Dropkick("#normal_select");

  $("#normal_select").append("<option value='new'>New option</option>");

  assert.equal(dk.options.length, 52, "Length doesn't match 52");
  assert.equal(dk.search("option").length, 0, "Found option before refresh was called");

  dk.refresh();

  assert.equal(dk.options.length, 53, "Length wasn't updated after refresh");
  assert.equal(dk.search("New option").length, 1, "Option search didn't return 'option'");
  assert.equal(dk.search("New option")[0], dk.item(52), "Can't find new option when searching");
});


QUnit.test( "Dropkick should return if no select is passed", 2, function( assert ) {
  var dk = new Dropkick("#nothing");

  assert.ok(dk);
  assert.ok(!dk.data);
});

QUnit.test( "Dropkick should return if no options are passed", 2, function( assert ) {
  var dk = new Dropkick("#empty");

  assert.ok(dk);
  assert.ok(!dk.data);
});
