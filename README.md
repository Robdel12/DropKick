# DropKick.js [![Build Status](https://travis-ci.org/Robdel12/DropKick.svg?branch=master)](https://travis-ci.org/Robdel12/DropKick)

# Quick start

### Basic Usage

- Download the latest stable version from the releases / tags section
- Insert the JS onto the page
- Put the stylesheet where you would like
- Add an ID or class to the select(s) you would like to DropKick

If you're using jQuery:
- `$("#ID").dropkick( options );`

Pure JS:
- Call `new Dropkick( HTMLSelectELement, Options );` or `new Dropkick( "ID", Options );` in your script

**Note: As of DropKick 2.1 we automatically include the polyfills and jQuery plugin.**

## Bower Install

You can install DropKick.js using bower:

`bower install dropkick --save-dev`


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

  - `"strict"` - The search string matches exactly from the beginning of the
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

- dk.**multiple** - *boolean* If this select is a multi-select

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
  for multi-selects).

- dk.**refresh**()

  Rebuilds the Dropkick and reinitialized the Dropkick object. *Only use if the
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
  or on multi-selects). Useful for selecting an option after a search by the user.

  Returns the selected Dropkick option.

- dk.**search**( *pattern*, *mode* )

  - `pattern` - *string* The string to search the options for
  - `mode` - *string* How the search is preformed; `"strict"`, `"partial"`,
    or `"fuzzy"`

  Finds all options whose text matches the given pattern based on the mode.

  - `"strict"` - The search string matches exactly from the beginning of the
    option's text value (case insensitive).
  - `"partial"` - The search string matches part of the option's text value
    (case insensitive).
  - `"fuzzy"` - The search string matches the characters in the given order (not
    exclusively). The strongest match is selected first. (case insensitive).

  Returns an array of matched Dropkick options. ***Note**: will return an empty
  array if no match is found.*


Suggestions or Bugs?
====================

Search for bugs ruthlessly and call any vermin to our attention!

## Authors
[Wil Wilsman](http://wilwilsman.com) [@wilwilsman](http://twitter.com/wilwilsman)

[Robert DeLuca](http://robert-deluca.com) [@robdel12](http://twitter.com/robdel12)
