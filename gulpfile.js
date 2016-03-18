var gulp = require('gulp')
var browserify = require('browserify')
var source = require('vinyl-source-stream')

var less = require('gulp-less')
var cssnano = require('gulp-cssnano')
var rename = require('gulp-rename')

var paths = {
  js: {
    source: 'src/js/index.js',
    watch: ['src/js/**/*.js*'],
    destination: 'public/assets/js',
    name: 'app.js',
    build_name: 'app.min.js'
  },
  less: {
    source: 'src/less/style.less',
    watch: ['src/less/**/*.less'],
    destination: 'public/assets/css',
    name: 'style.css',
    build_name: 'style.min.css'
  }
}

gulp.task('js', function () {
  return browserify(paths.js.source)
    .bundle()
    .pipe(source(paths.js.name))
    .pipe(gulp.dest(paths.js.destination))
})

gulp.task('less', function () {
  return gulp.src(paths.less.source)
    .pipe(less())
    .pipe(rename(paths.less.name))
    .pipe(gulp.dest(paths.less.destination))
})

gulp.task('build js', function () {
  return browserify(paths.js.source)
    .transform({
      global: true
    }, 'uglifyify')
    .bundle()
    .pipe(source(paths.js.build_name))
    .pipe(gulp.dest(paths.js.destination))
})

gulp.task('build less', function () {
  return gulp.src(paths.less.source)
    .pipe(less())
    .pipe(cssnano())
    .pipe(rename(paths.less.build_name))
    .pipe(gulp.dest(paths.less.destination))
})

gulp.task('watch js', function () {
  return gulp.watch(paths.js.watch, ['js'])
})

gulp.task('watch less', function () {
  return gulp.watch(paths.less.watch, ['less'])
})

gulp.task('watch', ['watch js', 'watch less'])
gulp.task('build', ['build js', 'build less'])
gulp.task('default', ['js', 'less', 'watch'])
