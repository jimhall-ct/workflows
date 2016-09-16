// Setup Plugins
var gulp = require('gulp'),
    util = require('gulp-util'),
    gulpif = require('gulp-if'),
    coffee = require('gulp-coffee'),
    concat = require('gulp-concat'),
    browserify = require('gulp-browserify'),
    uglify = require('gulp-uglify'),
    compass = require('gulp-compass'),
    htmlmin = require('gulp-htmlmin'),
    webserver = require('gulp-connect');

var build,
    outputDir,
    sassStyle;

// Define source files for tasks
var htmlSources = ['builds/development/*.html'];

var coffeeSources = ['components/coffee/tagline.coffee'];

var jsSources = ['components/scripts/rclick.js',
                 'components/scripts/pixgrid.js',
                 'components/scripts/tagline.js',
                 'components/scripts/template.js'
                 ];

var jsonSources = ['builds/development/js/*.json'];

var sassSources = ['components/sass/style.scss'];

var imageSources = ['builds/development/images/**/*'];

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
    .pipe(concat('script.js'))
    .pipe(browserify())
    .pipe(gulpif(build === 'production', uglify()))
    .pipe(gulp.dest(outputDir + 'js'))
    // Reload web page when js files are modified
    .pipe(webserver.reload())
});

// Process SASS files
gulp.task('compass', function() {
  gulp.src('components/sass/style.scss')
    .pipe(compass({
      sass: 'components/sass',
      css: outputDir + 'css',
      image: outputDir + 'images',
      comments: true,
      style: sassStyle
    }))
      .on('error', function(error) {
        console.log(error);
      })
    // gulp.dest doesn't seem to be necessary since compass
    // outputs to css property in config settings above
    //.pipe(gulp.dest('builds/development/css'))

    // Reload web page when sass files are modified
    .pipe(webserver.reload())
});

// Used by Watch task for reloading modifications
gulp.task('html', function() {
  gulp.src(htmlSources)
  .pipe(gulpif(build === 'production', htmlmin({
      removeComments: true,
      collapseWhitespace: true
      // Full List of options
      // https://github.com/kangax/html-minifier
  })))
  .pipe(gulpif(build === 'production', gulp.dest(outputDir)))
  .pipe(webserver.reload())
});

// Used by Watch task for reloading modifications
gulp.task('json', function() {
  gulp.src(jsonSources)
  .pipe(webserver.reload())
});

// Watch Task to update files when there is a change
gulp.task('watch', function() {
  gulp.watch(coffeeSources, ['coffee']);
  gulp.watch(jsSources, ['js']);
  gulp.watch('components/sass/*.scss', ['compass']);
  gulp.watch(htmlSources, ['html']);
  gulp.watch(jsonSources, ['json']);
});

gulp.task('webserver', function() {
  webserver.server({
    root: outputDir,
    livereload: true
  });
});

// Task for copying dev files to prod directories
gulp.task('prodFiles', function() {
  console.log("Copying files from development to production...")
  // Copy Image files to production directory
  gulp.src(imageSources)
  .pipe(gulp.dest('builds/production/images'))
  // Copy JSON files to production directory
  gulp.src(jsonSources)
  .pipe(gulp.dest('builds/production/js'))
});

// Setup default tasks ($> gulp) to run when launching gulp without arguments
gulp.task('default', ['developmentSetup', 'html', 'json', 'coffee', 'js', 'compass', 'webserver', 'watch']);

gulp.task('developmentSetup', function() {
  build = 'development';
  outputDir = 'builds/development/';
  sassStyle = 'expanded';
  util.log(util.colors.white.bold.bgGreen("DEVELOPMENT CODE"));
});

gulp.task('productionSetup', function() {
  build = 'production';
  outputDir = 'builds/production/';
  sassStyle = 'compressed';
  util.log(util.colors.white.bold.bgRed("PRODUCTION CODE - DO NOT EDIT FILES"));
});

gulp.task('production', ['productionSetup', 'prodFiles', 'html', 'coffee', 'js', 'compass', 'webserver']);
gulp.task('development', ['default']);
