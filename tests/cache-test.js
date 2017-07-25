import { expect } from 'chai';
import { $, buildSelect, setupTesting } from './utils/utils';
import Dropkick from '../src/dropkick';

// this needs to be set to false in order to test caching.
// if clean up is enabled it will destroy the select & dk
// instance between test runs.
const cleanUpAfterTests = false;

describe('Dropkick cache tests', function() {

  setupTesting(cleanUpAfterTests);

  beforeEach(function() {
    buildSelect("normal_select", ['first', 'second', 'fires']);
    this.cacheDk = new Dropkick("#normal_select");
  });

  it('creates a new Dropkick', function() {
    expect(this.cacheDk.data.select.getAttribute("data-dkcacheid")).equal('0');
    expect(window.Dropkick.uid).equal(1);
  });

  describe('reinit dropkick with the same select', function() {
    beforeEach(function() {
      this.cacheDk2 = new Dropkick("#normal_select");
    });

    it('uses the cached dk', function() {
      expect(window.Dropkick.uid).to.equal(1);
      expect(this.cacheDk2.data.select.getAttribute("data-dkcacheid")).equal('0');
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

  describe('disposing dropkick', function() {
    beforeEach(function() {
      this.cacheDk.dispose();
    });

    it('removes dk from the cache', function() {
      expect(window.Dropkick.cache[this.cacheDk.data.cacheID]).to.equal(undefined);
    });
  });

});
