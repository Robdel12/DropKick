DropKick
=
Creating custom dropdowns is usually a tedious process that requires a ton of extra setup time. Oftentimes lacking conveniences that native dropdowns have such as keyboard navigation. DropKick removes the tedium and lets you focus on making s@#t look good.

Requirements:
-
DropKick requires the latest version of jQuery, available at jQuery.com. Currently we're [using jQuery 1.10.2.](http://blog.jquery.com/2013/07/03/jquery-1-10-2-and-2-0-3-released/)

How it works:
-
DropKick works by transforming your existing, boring `<select>` lists into beautiful, customizable HTML dropdowns. The name attribute is the only one that is required. You should also set a tabindex attribute to enable navigation via tabbing.
When an option is selected in a DropKick menu, the corresponding `<select>` value is updated. This means that your forms and AJAX requests should work the same without having to make any changes.

Features:
-
* *Acts Just Like A Select*
* *Keyboard Navigation:*
   Keyboard navigation in DropKick is very similar to native `<select>` navigation.
   While highlighted, pressing enter, up, or down on your keyboard will open the dropdown.
   While opened, pressing up or down will navigate through the options, and pressing enter will select the currently highlighted option.

* *Dynamic Selects:*
 Use `$(object).dropkick('refresh')` method to update dropkick if the `<select>` content has changed dinamically

* *Theming:* 
  DropKick was made to be easily theme-able and supports dynamic theme changing.

* *Custom Callbacks*

How to use:
-
* Make sure you have jQuery 1.10 or later running
* Add all the DK files to their proper spots (CSS files can be added to your main CSS file if you like)
* Set a `class` or `id` on the select(s)
* Call `$('#select').dropkick();`
* Have a happy time with new awesome selects!

Please see examples.html or [the DropKick homepage](http://robdel12.github.com/DropKick/) for more ways to use DK.


Compatibility:
-
DropKick was tested on Opera 10+, Google Chrome 10+, FireFox 5+, Safari 5+, and Internet Explorer 7+. IE6 is not supported and will simply continue using your plain dropdowns instead.

Whats new in 1.3?
-
Changes thanks to [acemir](https://github.com/acemir)!
* ADDITION : DK now reverts to the orginal selects on mobile while still maintaining styled ".dk_toogle"
* ADDITION : Ability to force dropkick normal mobile through setting {nativeMobile : false }
* IMPROVES : performance through chaining some operations
* IMPROVES : reset method
* FIX : setValue method now assesses the existence of the option in the before applying
* CLEAN : reload/refresh duplicated methods, now is just refresh 
* CLEAN : things unused and redundant
* Fixes the theme and refresh methods to work both if or dk_container are called
* Bring back filter gradients for themes in IE < 8

[What changed in previous versions?](https://github.com/Robdel12/DropKick/wiki/Previous-version-changes)

Found a bug? 
-
Please [let us know](https://github.com/robdel12/DropKick/issues).

What next: 
-
### Version 2.0
Version 2.0 is going to be a compleate rewrite of the plugin. Suggestions are welcome for features :)

Got an idea for improving DropKick? Or maybe a bug fix? Please feel free to fork a copy and submit a pull request! We've merged in over 30 pull requests in the past month. We're no stranger to it

Maintained by:
-
[Robert DeLuca](http://twitter.com/robdel12)

[Wil Wilsman](http://twitter.com/wwilsman)

Created by:
-
[Jamie Lottering](http://twitter.com/jamielottering), default theme designed by [Addison Kowalski](http://twitter.com/addisonkowalski)
