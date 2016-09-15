var gulp = require('gulp'),
    webpack = require('gulp-webpack'),
    coffee = require('gulp-coffee');

var coffeeSources = ['components/coffee/tagline.coffee'],
    coffeeDestination = 'components/scripts';

var jsSources = ['components/scripts/pixgrid.js',
                 'components/scripts/rclick.js',
                 'components/scripts/template.js',
                 'components/scripts/tagline.js'];

gulp.task('coffee', function() {
  gulp.src(coffeeSources)
    .pipe(coffee({bare: true}).on('error', function() {
        console.log("Error in CoffeeScript")
      }))
    .pipe(gulp.dest(coffeeDestination))
});

gulp.task('js', function() {
  gulp.src(jsSources)
    .pipe(webpack({
      output: {
        filename: 'bundle.js'
      }
    }))
    .pipe(gulp.dest('builds/development/js'))
});