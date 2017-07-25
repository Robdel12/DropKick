import jQuery from 'jquery';
import sinonChai from 'sinon-chai';
import jqueryChai from 'chai-jquery';
import chai from 'chai';

chai.use(sinonChai);
chai.use((chai, utils) => jqueryChai(chai, utils, jQuery));

export { default as $ } from 'jquery';

/**
 * Build a HTMLSelectElement and insert it into the testing
 * container.
 *
 * @param { String } id
 * @param { Array } options
 * @param { Boolean } isMultiSelect
 * @param { DOM Node } appendEl - element which to append the select
 * to
 * @returns { DOM Node } selectEl - newly created select element
 */
export function buildSelect(id, options, isMultiSelect = false, appendEl) {
  let selectEl = document.getElementById(id);

  if (selectEl) { return selectEl; }

  selectEl = document.createElement("select");
  let testingContainerEl = document.getElementById('testingContainer');
  // if nothing is passed, append to the normal container
  if (!appendEl) { appendEl = testingContainerEl;}

  selectEl.id = id;
  selectEl.multiple = isMultiSelect;
  appendEl.appendChild(selectEl);

  options.forEach(option => {
    let optionEl = document.createElement("option");

    optionEl.value = option;
    optionEl.text = option;

    selectEl.appendChild(optionEl);
  });

  return selectEl;
}

/**
 * Create an iframe and append it to the testing container
 *
 * @param { String } id
 * @returns { DOM Node } iframeEl - newly created iframe
 */
export function buildIframe(id) {
  let iframeEl = document.getElementById(id);
  let testingContainerEl = document.getElementById('testingContainer');

  if (iframeEl) { return iframeEl; }

  iframeEl = document.createElement('iframe');
  iframeEl.id = id;
  testingContainerEl.appendChild(iframeEl);

  return iframeEl;
}

/**
 * Setup the testing container and clean it up after each assertion.
 *
 * @param { Boolean } cleanUpAfterTests - enable clearing out the test
 * containers children
 */
export function setupTesting(cleanUpAfterTests = true) {
  let testingContainer = document.getElementById('testingContainer');

  if (!testingContainer) {
    testingContainer = document.createElement('div');
    testingContainer.id = "testingContainer";
    document.body.appendChild(testingContainer);
  }

  if (cleanUpAfterTests) {
    testingContainer.innerHTML = "";

    afterEach(function() {
      testingContainer.innerHTML = "";
    });
  }
}
