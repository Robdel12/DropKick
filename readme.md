# DropKick.js [![Build Status](https://travis-ci.org/Robdel12/DropKick.svg?branch=master)](https://travis-ci.org/Robdel12/DropKick)

# Quick start

### Basic Usage

- Download the files from the `production` folder
- Insert the JS onto the page
- Put the stylesheet where you would like
- Add an ID or class to the select(s) you would like to DropKick
- Call `new Dropkick( HTMLSelectELement, Options );` or `new Dropkick( ID, Options );` in your script

### Using the jQuery plugin

As you can see from `dropkick.jquery.js` using any library is a breeze!

1. Import `dropkick.jquery.js` on the page after `dropkick.js`
2. Do ya thang! `$(".something").dropkick()`

Documentation
=============

### Options

- **initialize**: *function*

  Called when the Dropkick object is initialized.
  The value of `this` is the Dropkick object itself.

- **change**: *function*

  Called whenever the value of the Dropkick select changes (by user action or
  through the API).
  The value of `this` is the Dropkick object itself.

- **open**: *function*

  Called whenever the Dropkick select is opened.
  The value of `this` is the Dropkick object itself.

- **close**: *function*

  Called whenever the Dropkick select is closed.
  The value of `this` is the Dropkick object itself.

- **search**: *string*

  - `"strict"` - The search string matches exactly from the begining of the
    option's text value (case insensitive).
  - `"partial"` - The search string matches part of the option's text value
    (case insensitive).
  - `"fuzzy"` - The search string matches the characters in the given order (not
    exclusively). The strongest match is selected first. (case insensitive).

  Defaults to `"strict"`.

- **mobile**: *boolean*

  If `true`, it will render the Dropkick element for mobile devices also.
  Defaults to `false`.

### Properties

- dk.**data** - *object*
  - **elem** - *node* The Dropkick element
  - **select** - *node* The origianl select element
  - **settings** - *object* The options (defaults and passed)

- dk.**value** - *string* The current value of the select

- dk.**disabled** - *boolean* Whether the form is currently disabled or not

- dk.**form** - *node* The form associated with the select

- dk.**length** - *integer* The number of options in the select

- dk.**options** - *array* An array of Dropkick options

- dk.**multiple** - *boolean* If this select is a multiselect

- dk.**selectedOptions** - *array* An array of selected Dropkick options

- dk.**selectedIndex** - *integer* An index of the first selected option

### Methods

- dk.**add**( *elem*, *before* )

  - `elem` - *Node/String* The HTMLOptionElement or a string to be inserted
  - `before` - *Node/Integer* HTMLOptionElement/Index `elem` is to be
    inserted before

  Adds an element to the select. This option will not only add it to the original
  select, but create a Dropkick option and add it to the Dropkick select.

- dk.**item**( *index* )

  - `index` - *integer*

  Selects an option in the list at the desired index (negative numbers select
  from the end).

  Returns the Dropkick option from the list, or null if not found.

- dk.**remove**( *index* )

  - `index` - *integer*

  Removes the option (from both the select and Dropkick) at the given index.

- dk.**disable**( *elem*, *disabled* )

  - `elem` - *node/integer* The Dropkick option or Index of an option
  - `disabled` - *boolean* The value of disabled (default is `true`)

  Disables or enables an option; if only a boolean is passed (or nothing),
  then the entire Dropkick will be disabled or enabled.

- dk.**reset**( *clear* )

  - `clear` - *boolean*

  Resets the Dropkick and select to it's original selected options; if `clear`
  is `true`, It will select the first option by default (or no options
  for multiselects).

- dk.**refresh**()

  Rebuilds the Dropkick and reinitalized the Dropkick object. *Only use if the
  original select element has changed.

- dk.**dispose**()

  Removes the Dropkick element from the DOM and the object from the cache.

  Returns itself.

- dk.**open**()

  Opens the Dropkick. Can even open disabled dropkicks.

- dk.**close**()

  Closes the Dropkick.

- dk.**select**( *elem*, *disabled* )

  - `elem` - *node/integer/string* The Dropkick option, index of an option, or
  value of an option to select
  - `disabled` - *boolean* Allow the selecting of disabled options

  Selects an option from the list.

  Returns the selected Dropkick option.

- dk.**selectOne**( *elem*, *disabled* )

  - `elem` - *node/integer* The Dropkick option or Index of an option to select
  - `disabled` - *boolean* Allow the selecting of disabled options

  Selects a single option from the list and scrolls to it (if the select is open
  or on multiselects). Useful for selecting an option after a search by the user.

  Returns the selected Dropkick option.

- dk.**search**( *pattern*, *mode* )

  - `pattern` - *string* The string to search the options for
  - `mode` - *string* How the search is preformed; `"strict"`, `"partial"`,
    or `"fuzzy"`

  Finds all options whose text matches the given pattern based on the mode.

  - `"strict"` - The search string matches exactly from the begining of the
    option's text value (case insensitive).
  - `"partial"` - The search string matches part of the option's text value
    (case insensitive).
  - `"fuzzy"` - The search string matches the characters in the given order (not
    exclusively). The strongest match is selected first. (case insensitive).

  Returns an array of matched Dropkick options. ***Note**: will return an empty
  array if no match is found.*

## Contributing to DropKick.js

### Creating an issue
- Give a description of the issue and what version of DK.
- Tell us any other JS that might be running on the same page.
- Please please provide a JS bin or codepen example. It's the easiest way for us to figure out what's wrong.

### Adding or editing code
- Fork Dropkick
- Run `npm install` to install all the dev dependancies
- Make your changes
  - You can chose to do the changes on either the `develop` branch or `master` branch of your fork
  - Follow the same coding style that's written in dropkick.js. ** Not doing this will result in a lot of comments on your pull request*
- Write tests
  - If you're adding a feature write a test for it
  - If you're fixing a bug write a test for it.
- Run `gulp` from your command line.
  - The default runner will run the test suite, lint, and minify the JS.
- If all tests pass you can create a pull request vs the `develop` branch. Tag any related github issue tickets in the PR.

**If you fail to do any of these we probably will not accept your changes**

Suggestions or Bugs?
====================

Search for bugs ruthlessly and call any vermin to our attention!

## Authors
[Wil Wilsman](http://wilwilsman.com) [@wilwilsman](http://twitter.com/wilwilsman)

[Robert DeLuca](http://robert-deluca.com) [@robdel12](http://twitter.com/robdel12)
