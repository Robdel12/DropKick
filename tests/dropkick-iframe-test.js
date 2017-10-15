import { expect } from 'chai';
import {
  $,
  buildSelect,
  buildIframe,
  setupTesting
} from './utils/utils';
import Dropkick from '../src/dropkick';

describe('Dropkick iframe tests', function() {
  beforeEach(function() {
    buildSelect("normal_select", ['first', 'second', 'fires']);
    this.dk = new Dropkick("#normal_select");
    // build an iframe & insert into test container
    this.iframe = buildIframe('iframe');
    // create select & insert into iframe
    this.select = buildSelect('iframe_select', ['one', 'two', 'three'], false, this.iframe.contentDocument.body);
    this.iframeSelect = new Dropkick(this.select);
    // open select
    this.iframeSelect.open();
  });

  it('opens the select', function() {
    let select = $(this.iframe.contentDocument).find('.dk-select');

    expect(select.hasClass('dk-select-open-down')).to.equal(true);
  });

  describe('clicking outside of the iframe', function() {
    beforeEach(function() {
      $('#testingContainer').click();
    });

    it('closes the select', function() {
      let select = $(this.iframe.contentDocument).find('.dk-select');

      expect(select.hasClass('dk-select-open-down')).to.equal(false);
    });
  });
});
