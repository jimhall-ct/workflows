// Setup Plugins
var gulp = require('gulp'),
    webpack = require('gulp-webpack'),
    compass = require('gulp-compass'),
    coffee = require('gulp-coffee');

// Define source files for tasks
var coffeeSources = ['components/coffee/tagline.coffee'];

var jsSources = ['components/scripts/pixgrid.js',
                 'components/scripts/rclick.js',
                 'components/scripts/template.js',
                 'components/scripts/tagline.js'];

var sassSources = ['components/sass/style.scss'];

// Process Coffee Script files
gulp.task('coffee', function() {
  gulp.src(coffeeSources)
    .pipe(coffee({bare: true}).on('error', function(error) {
        console.log(error);
      }))
    .pipe(gulp.dest('components/scripts'))
});

// Process JavaScript files
gulp.task('js', function() {
  gulp.src(jsSources)
    .pipe(webpack({
      output: {
        filename: 'bundle.js'
      }
    }))
    .pipe(gulp.dest('builds/development/js'))
});

// Process SASS files
gulp.task('compass', function() {
  gulp.src('components/sass/style.scss')
    .pipe(compass({
      sass: 'components/sass',
      css: 'builds/development/css',
      image: 'builds/development/images',
      environment: 'development',
      comments: true,
      style: 'expanded'
    }))
      .on('error', function(error) {
        console.log(error);
      })
    // gulp.dest doesn't seem to be necessary since compass
    // outputs to css property in config settings above
    //.pipe(gulp.dest('builds/development/css'))
});

// Watch Task to update files when there is a change
gulp.task('watch', function() {
  gulp.watch(coffeeSources, ['coffee']);
  gulp.watch(jsSources, ['js']);
  gulp.watch('components/sass/*.scss', ['compass']);
});

// Setup default tasks ($> gulp) to run when launching gulp without arguments
gulp.task('default', ['coffee', 'js', 'compass']);
