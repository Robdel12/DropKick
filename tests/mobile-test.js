import { expect } from 'chai';
import { $, buildSelect, setupTesting } from './utils/utils';
import Dropkick from '../src/dropkick';
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test( navigator.userAgent );

if (isMobile) {
  describe('Dropkick mobile tests', function() {
    beforeEach(function() {
      buildSelect("mobile_dk", ['first', 'second', 'fires']);
      this.mobileDk = new Dropkick('#mobile_dk', {
        mobile: false
      });
    });

    it('does not build dropkick', function() {
      expect($('.dk-select').length).to.equal(0);
    });

    describe('calling select', function() {
      beforeEach(function() {
        this.mobileDk.select(2);
      });

      it('selects the correct value on the original select', function() {
        expect($('#mobile_dk').val()).to.equal('fires');
      });
    });

    describe('adding an option', function() {
      before(function() {
        this.mobileDk.add('The last', 3);
      });

      it('adds an option to the normal select', function() {
        expect($('#mobile_dk option')[3].innerText).to.equal('The last');
      });

      describe('removing an option', function() {
        beforeEach(function() {
          this.mobileDk.remove(3);
        });

        it('removes the option', function() {
          expect($('#mobile_dk option').length).to.equal(3);
          expect($('#mobile_dk option')[3]).to.equal(undefined);
        });
      });
    });
  });
}
