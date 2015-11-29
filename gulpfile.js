var jshint = require('gulp-jshint');
var gulp = require('gulp');
var child_process = require('child_process');

gulp.task('start', function() {
    console.log('did nothing :P');
});

gulp.task('lint', function() {
    gulp.src(['feature_flipper.js', 'storage/*'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
})

gulp.task('redis-start', function() {
  child_process.exec('redis-server', function(err, stdout, stderr) {
    console.log(stdout);
    if (err !== null) {
      console.log('exec error: ' + err);
    }
  });
});
