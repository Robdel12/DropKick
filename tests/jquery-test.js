import { expect } from 'chai';
import { $, buildSelect, setupTesting } from './utils/utils';
import Dropkick from '../src/dropkick';

describe('Dropkick jQuery tests', function() {
  let $select;

  setupTesting();

  beforeEach(function() {
    let select = buildSelect('jquery_select', ['1', '2']);
    $select = $(select).dropkick();
  });

  it('builds a dropkick select', function() {
    expect($('.dk-select').length).to.equal(1);
  });
});
