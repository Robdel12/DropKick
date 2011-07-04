DropKick
=
Creating custom dropdowns is usually a tedious process that requires a ton of extra setup time. Oftentimes lacking conveniences that native dropdowns have such as keyboard navigation. DropKick removes the tedium and lets you focus on making s@#t look good.

Requirements:
-
DropKick requires the latest version of jQuery, available at jQuery.com. Other than jQuery, you should include scrollability.js if you want to enable scrolling on iOS devices (you do).

How it works:
-
DropKick works by transforming your existing, boring `<select>` lists into beautiful, customizable HTML dropdowns. The name attribute is the only one that is required. You should also set a tabindex attribute to enable navigation via tabbing.
When an option is selected in a DropKick menu, the corresponding `<select>` value is updated. This means that your forms and AJAX requests should work the same without having to make any changes. However, if you previously had
an `onchange` event bound to your `<select>` list, you will have to instead use a DropKick change event. Please see examples.html for usage

Features:
-
* *Keyboard Navigation:*
   Keyboard navigation in DropKick is very similar to native `<select>` navigation.
   While highlighted, pressing enter, up, or down on your keyboard will open the dropdown.
   While opened, pressing up or down will navigate through the options, and pressing enter will select the currently highlighted option.

* *Themeing:* 
  DropKick was made to be easily theme-able and supports dynamic theme changing.

* *Custom Callbacks*

Compatibility:
-
DropKick was tested on Opera 10+, Google Chrome 10+, FireFox 5+, Safari 5+, and Internet Explorer 7 - 8. IE6 is not supported and will simply continue using your plain dropdowns instead.

Known Issues:
-
* Opened DropKick menus on Internet Explorer 7 will be covered by other DropKick containers if they are vertically stacked and too close together.

Found a bug? Please [let me know](https://github.com/JamieLottering/DropKick/issues).

How to use:
-
Please see examples.html or [the DropKick homepage](http://jamielottering.github.com/DropKick/) for usage

What next:
-
Got an idea for improving DropKick? Or maybe a bug fix? Please feel free to fork a copy and submit a pull request!

Created by:
-
[Jamie Lottering](http://twitter.com/jamielottering), default theme designed by [Addison Kowalski](http://twitter.com/addisonkowalski)