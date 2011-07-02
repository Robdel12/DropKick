DropKick
========
Simple, Beautiful, Graceful. Dropdowns.
--------
***
How to use:
--------

DropKick requires the latest version of jQuery and Mustache.js, both of which are included here. DropKick works by taking regular `<select>` lists and turning them into a customizable, more modern dropdown menu. Because of this, functionality is not impaired in any way if the user has Javascript disabled. Your forms and Ajax requests will continue working as normal with no changes necessary.

1. Include jquery.dropkick.min.js, jquery.-1.6.1.js, and mustache.js in your document.
2. Create a `<select>` list in regular HTML. ID and name attributes are required.
3. Add the following right before the closing `</body>` tag

    `$(function () {`
        `$('#id_of_your_select_list').dropkick();`
    `});`
