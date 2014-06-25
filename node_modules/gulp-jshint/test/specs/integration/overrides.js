var gutil = require('gulp-util');
var jshint = require('../../../src');

module.exports = function () {
  describe('overrides option', function () {
    it('should override the config when matching patterns are found', function(done) {
      var fakeFile = new gutil.File({
        path: './test/fixture/fileIndent4.js',
        base: './',
        contents: new Buffer('wadup();')
      });

      var fakeFile2 = new gutil.File({
        path: './test/fixture/fileIndent8.js',
        base: './',
        contents: new Buffer('wadup();')
      });

      var stream = jshint();
      stream.on('data', function(file){
        if (file.relative === "test/fixture/fileIndent4.js") {
          file.jshint.opt.indent.should.equal(4);
        }

        if (file.relative === "test/fixture/fileIndent8.js") {
          file.jshint.opt.indent.should.equal(8);
        }
      });

      stream.once('end', function () {
        done();
      });

      stream.write(fakeFile);
      stream.write(fakeFile2);
      stream.end();
    });
  });
};
