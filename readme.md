DropKick
=
Creating custom dropdowns is usually a tedious process that requires a ton of extra setup time. Oftentimes lacking conveniences that native dropdowns have such as keyboard navigation. DropKick removes the tedium and lets you focus on making s@#t look good.

Requirements:
-
DropKick requires the latest version of jQuery, available at jQuery.com. Currently we're [using jQuery 1.10.2.](http://blog.jquery.com/2013/07/03/jquery-1-10-2-and-2-0-3-released/)

How it works:
-
DropKick works by transforming your existing, boring `<select>` lists into beautiful, customizable HTML dropdowns. The name attribute is the only one that is required. You should also set a tabindex attribute to enable navigation via tabbing.
When an option is selected in a DropKick menu, the corresponding `<select>` value is updated. This means that your forms and AJAX requests should work the same without having to make any changes. However, if you previously had
an `onchange` event bound to your `<select>` list, you will have to instead use a DropKick change event. Please see examples.html for usage

Features:
-
# To do: go back through these features and actually write a good list out

* *Keyboard Navigation:*
   Keyboard navigation in DropKick is very similar to native `<select>` navigation.
   While highlighted, pressing enter, up, or down on your keyboard will open the dropdown.
   While opened, pressing up or down will navigate through the options, and pressing enter will select the currently highlighted option.

Use `$(object).dropkick('refresh')` method to update dropkick if the `<select>` content has changed dinamically

* *Themeing:* 
  DropKick was made to be easily theme-able and supports dynamic theme changing.

* *Custom Callbacks*

Compatibility:
-
DropKick was tested on Opera 10+, Google Chrome 10+, FireFox 5+, Safari 5+, and Internet Explorer 7 - 8. IE6 is not supported and will simply continue using your plain dropdowns instead.

iOS is supported natively without any additional add-ons required. It opens up the default select picker while you still have custom styled selects.

Known Issues:
-
# To do: there are a lot. Lets get them either in here or fixed ;)

Found a bug? Please [let me know](https://github.com/robdel12/DropKick/issues).

How to use:
-
# To do: do a little guide in the readme and then update example page.
Please see examples.html or [the DropKick homepage](http://robdel12.github.com/DropKick/) for usage

## What next: 
#### Version 2.0
Version 2.0 is going to be a compleate rewrite of the plugin. Suggestions are welcome for features :)

Got an idea for improving DropKick? Or maybe a bug fix? Please feel free to fork a copy and submit a pull request! We've merged in over 30 pull requests in the past month. We're no stranger to it

Maintained by:
-
[Robert DeLuca](http://twitter.com/robdel12)

Created by:
-
[Jamie Lottering](http://twitter.com/jamielottering), default theme designed by [Addison Kowalski](http://twitter.com/addisonkowalski)
