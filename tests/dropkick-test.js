import { expect } from 'chai';
import { $ } from './utils.js';
import Dropkick from '../src/dropkick.js';


function buildSelect(id, options) {
  if (document.getElementById(id)) { return false; }

  let selectEl = document.createElement("select");

  selectEl.id = id;
  document.body.appendChild(selectEl);

  options.forEach(option => {
    let optionEl = document.createElement("option");

    optionEl.value = option;
    optionEl.text = option;

    selectEl.appendChild(optionEl);
  });
}

describe('Dropkick tests', function() {
  beforeEach(function() {
    buildSelect("normal_select", ['first', 'second', 'fires']);
    this.dk = new Dropkick("#normal_select");
  });

  it('creates a new Dropkick', function() {
    expect(this.dk.length).to.equal(3);
    expect(this.dk.options.length).to.equal(3);
    expect(this.dk.data.select.id).equal("normal_select");
    expect(this.dk.data.select.getAttribute("data-dkcacheid")).equal('0');
    expect(window.Dropkick.uid).equal(1);
  });

  it('strict searching for first', function() {
    let result = this.dk.search('first', 'strict');

    expect(result.length).equals(1);
    expect(result[0]).equals(this.dk.item(0));
  });

  it('fuzzy searching for first', function() {
    let result = this.dk.search('fir', 'fuzzy');

    expect(result.length).equals(2);
    expect(result[0]).equals(this.dk.item(0));
    expect(result[1]).equals(this.dk.item(2));
  });

  describe('reinit dropkick with the same select', function() {
    beforeEach(function() {
      this.dk2 = new Dropkick("#normal_select");
    });

    it('uses the cached dk', function() {
      expect(window.Dropkick.uid).to.equal(1);
      expect(this.dk2.data.select.getAttribute("data-dkcacheid")).equal('0');
    });
  });

  describe('init dropkick with a new select', function() {
    beforeEach(function() {
      buildSelect("second_select", ['first', 'second']);
      this.secondDK = new Dropkick("#second_select");
    });

    it('increases the uid to 2', function() {
      expect(this.secondDK.data.select.getAttribute("data-dkcacheid")).equal('1');
      expect(window.Dropkick.uid).equal(2);
    });
  });

  describe('selecting a new option', function() {
    beforeEach(function() {
      this.dk.select(1);
    });

    it('selects the new option', function() {
      expect($('#normal_select').val()).to.equal('second');
      expect(this.dk.data.select.value).to.equal('second');
      expect(this.dk.item(this.dk.selectedIndex).innerText).to.equal('second');
    });

    describe('resetting the selection', function() {
      beforeEach(function() {
        this.dk.reset();
      });

      it('resets the selection', function() {
        expect($('#normal_select').val()).to.equal('first');
        expect(this.dk.data.select.value).to.equal('first');
        expect(this.dk.item(this.dk.selectedIndex).innerText).to.equal('first');
      });
    });

  });

  describe('calling the open the method', function() {
    beforeEach(function() {
      this.dk.open();
    });

    it('opens the select', function() {
      expect($('#dk0-normal_select').hasClass('dk-select-open-down')).to.equal(true);
    });

    describe('calling the close method', function() {
      beforeEach(function() {
        this.dk.close();
      });

      it('closes the select', function() {
        expect($('#dk0-normal_select').hasClass('dk-select-open-down')).to.equal(false);
      });
    });

  });

  describe('adding an option', function() {
    before(function() {
      this.dk.add('third', 2);
    });

    it('adds the option', function() {
      expect(this.dk.length).to.equal(4);
      expect(this.dk.sel.options[2].innerText).to.equal('third');
    });

    describe('removing the newly added option', function() {
      beforeEach(function() {
        this.dk.remove(2);
      });

      it('removes the correct option', function() {
        expect(this.dk.length).to.equal(3);
        expect(this.dk.sel.options[2].innerText).to.equal('fires');
      });
    });

  });

  describe('calling disable on the entire select', function() {
    beforeEach(function() {
      this.dk.disable();
    });

    it('disables the select', function() {
      let dkElm = $('#dk0-normal_select');

      expect(dkElm.hasClass('dk-select-disabled')).to.equal(true);
      expect(dkElm.attr('aria-disabled')).to.equal('true');
    });

    describe('calling disable with true', function() {
      beforeEach(function() {
        this.dk.disable(false);
      });

      it('enables the select', function() {
        let dkElm = $('#dk0-normal_select');

        expect(dkElm.hasClass('dk-select-disabled')).to.equal(false);
        expect(dkElm.attr('aria-disabled')).to.equal('false');
      });
    });
  });

  describe('disabling an option', function() {
    beforeEach(function() {
      this.dk.disable(1, true);
    });

    it('disables the correct option', function() {
      let optionElm = $(this.dk.item(1));

      expect(optionElm.attr('aria-disabled')).to.equal('true');
      expect(optionElm.hasClass('dk-option-disabled')).to.equal(true);
    });

    describe('renabling an option', function() {
      beforeEach(function() {
        this.dk.disable(1, false);
      });

      it('enables the correct option', function() {
        let optionElm = $(this.dk.item(1));

        expect(optionElm.attr('aria-disabled')).to.equal('false');
        expect(optionElm.hasClass('dk-option-disabled')).to.equal(false);
      });
    });
  });

  describe('hiding an option', function() {
    beforeEach(function() {
      this.dk.hide(1, true);
    });

    it('hides the correct option', function() {
      let optionElm = $(this.dk.item(1));

      expect(optionElm.hasClass('dk-option-hidden')).to.equal(true);
      expect(optionElm.attr('aria-hidden')).to.equal('true');
    });

    describe('unhiding an option', function() {
      beforeEach(function() {
        this.dk.hide(1, false);
      });

      it('hides the correct option', function() {
        let optionElm = $(this.dk.item(1));

        expect(optionElm.hasClass('dk-option-hidden')).to.equal(false);
        expect(optionElm.attr('aria-hidden')).to.equal('false');
      });
    });
  });

});

// QUnit.test( "Checks if multi select is true", 1, function( assert ) {
//   var dk_multi = new Dropkick("#multiple");

//   assert.equal(dk_multi.multiple, true);
// });

// QUnit.test( "Dispose should remove dropkick from cache", 2, function( assert ) {
//   var dk = new Dropkick("#normal_select");

//   assert.ok(Dropkick.cache[dk.data.cacheID] === dk);

//   dk.dispose();

//   assert.ok(Dropkick.cache[dk.data.cacheID] === undefined);
// });

// QUnit.test( "Dropkick refresh should work", 5, function( assert ) {
//   var dk = new Dropkick("#normal_select");

//   $("#normal_select").append("<option value='new'>New option</option>");

//   assert.equal(dk.options.length, 52, "Length doesn't match 52");
//   assert.equal(dk.search("option").length, 0, "Found option before refresh was called");

//   dk.refresh();

//   assert.equal(dk.options.length, 53, "Length wasn't updated after refresh");
//   assert.equal(dk.search("New option").length, 1, "Option search didn't return 'option'");
//   assert.equal(dk.search("New option")[0], dk.item(52), "Can't find new option when searching");
// });


// QUnit.test( "Dropkick should return if no select is passed", 2, function( assert ) {
//   var dk = new Dropkick("#nothing");

//   assert.ok(dk);
//   assert.ok(!dk.data);
// });

// QUnit.test( "Dropkick should return if no options are passed", 2, function( assert ) {
//   var dk = new Dropkick("#empty");

//   assert.ok(dk);
//   assert.ok(!dk.data);
// });
