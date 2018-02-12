import { expect } from 'chai';
import {
  $,
  buildSelect,
  buildIframe,
  setupTesting
} from './utils/utils';
import Dropkick from '../src/dropkick';

describe('Dropkick tests', function() {
  setupTesting();

  beforeEach(function() {
    buildSelect("normal_select", ['first', 'second', 'fires']);
    this.dk = new Dropkick("#normal_select");
  });

  it('creates a new Dropkick', function() {
    expect(this.dk.length).to.equal(3);
    expect(this.dk.options.length).to.equal(3);
    expect(this.dk.data.select.id).equal("normal_select");
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
      expect($('.dk-select').hasClass('dk-select-open-down')).to.equal(true);
    });

    describe('calling the close method', function() {
      beforeEach(function() {
        this.dk.close();
      });

      it('closes the select', function() {
        expect($('.dk-select').hasClass('dk-select-open-down')).to.equal(false);
      });
    });

  });

  describe('adding an option', function() {
    beforeEach(function() {
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
      let dkElm = $('.dk-select');

      expect(dkElm.hasClass('dk-select-disabled')).to.equal(true);
      expect(dkElm.attr('aria-disabled')).to.equal('true');
    });

    describe('calling disable with true', function() {
      beforeEach(function() {
        this.dk.disable(false);
      });

      it('enables the select', function() {
        let dkElm = $('.dk-select');

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

  describe('calling dropkick with no select', function() {
    beforeEach(function() {
      try {
        new Dropkick('#doesNotExist');
      } catch(e) {
        this.error = e;
      }
    });

    it('throws an error', function() {
      expect(this.error).to.equal('You must pass a select to DropKick');
    });
  });

  describe('calling dropkick with no options', function() {
    beforeEach(function() {
      buildSelect('no_options', []);
      try {
        new Dropkick('#no_options');
      } catch(e) {
        this.error = e;
      }
    });

    it('throws an error', function() {
      expect(this.error).to.equal('You must have options inside your <select>: #no_options');
    });
  });

  describe('calling refresh after adding new option', function() {
    beforeEach(function() {
      $("#normal_select").append("<option value='new'>New option</option>");
      this.dk.refresh();
    });

    it('adds the new option to dk', function() {
      let option = this.dk.search('New option')[0].innerText;

      expect(option).to.equal('New option');
    });
  });


  describe('multi-select', function() {
    beforeEach(function() {
      buildSelect('multi', ['one', 'two', 'three'], true);
      this.multiDk = new Dropkick('#multi');
    });

    it('creates a multiselect dk', function() {
      expect(this.multiDk.multiple).to.equal(true);
    });

    it('toggles selected class when selected', function() {
      let sel = this.multiDk.select(0);
      expect($(sel).hasClass('dk-option-selected')).to.equal(true);
    })
  });

  describe('disabled optgroups', function() {
    beforeEach(function() {
      $('#normal_select').append('<optgroup disabled label="Maybe"><option value="one">One</option></optgroup>');
      this.dk.refresh();
    });

    it('has a disabled optgroup', function() {
      expect($('.dk-optgroup').hasClass('dk-optgroup-disabled')).to.equal(true);
    });

    describe('clicking the disabled optgroup', function() {
      beforeEach(function() {
        this.dk.open();
        $('.dk-optgroup-options li:first').click();
      });

      it('does not select the disabled option', function() {
        expect($('.dk-selected').text()).to.equal('first');
      });
    });
  });
});
