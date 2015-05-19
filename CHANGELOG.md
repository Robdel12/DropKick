# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [2.1.4] - [05/19/2014]
### Added
- Changelog
- YUIDoc for doc generating
- Custom theme for YUIDoc

### Changed
- File location for dropkick.js. Used to be in root, now it lives in the `lib` folder
- File location for dropkick.css. Used to be in `css`, now it lives in the `lib/css` folder
- The way we handle our polyfills and build process changed.
- Fixed customevent issues in all versions of IE [Commit](https://github.com/Robdel12/DropKick/commit/d1b348563d0e4bf775b90be1d275bc9513caf0d3)
- Fixed `nodeName of null` error for issue #282 [Commit](https://github.com/Robdel12/DropKick/commit/5d439bfa2567ad99388f5874c9b355937151a32e)
- Fixed issue with e.offsetTop for issue #289 [Commit](https://github.com/Robdel12/DropKick/commit/5661c3a714556da376788909ac254b8218e43737)
