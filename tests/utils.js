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
 */
export function buildSelect(id, options, isMultiSelect = false) {
  if (document.getElementById(id)) { return false; }

  let selectEl = document.createElement("select");
  let testingContainerEl = document.getElementById('testingContainer');

  selectEl.id = id;
  selectEl.multiple = isMultiSelect;
  testingContainerEl.appendChild(selectEl);

  options.forEach(option => {
    let optionEl = document.createElement("option");

    optionEl.value = option;
    optionEl.text = option;

    selectEl.appendChild(optionEl);
  });
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
    afterEach(function() {
      testingContainer.innerHTML = "";
    });
  }
}
