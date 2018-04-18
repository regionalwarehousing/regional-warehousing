const gulp = require('gulp')
const coffee = require('gulp-coffee')
const babel = require('gulp-babel')
const pug = require('gulp-pug')
const sass = require('gulp-ruby-sass')
const concat = require('gulp-concat')
const connect = require('gulp-connect')
const uglify = require('gulp-uglify')
const pump = require('pump')
const cssCondense = require('gulp-css-condense')

const coffeeSrc = './src/coffeescript/*.coffee'
const sassSrc = './src/sass/index.sass'
const pugSrc = './src/pug/*.pug'

gulp.task('build-js-vendor', cb => {
  pump([
    gulp.src([
      './node_modules/jquery/dist/jquery.js', 
      './node_modules/foundation-sites/js/foundation.core.js',
      './node_modules/foundation-sites/js/foundation.util.mediaQuery.js',
      './node_modules/foundation-sites/js/*.js'
    ]),
    babel(),
    concat('vendor.js'),
    uglify(),
    gulp.dest('./build/public/scripts/vendor')
  ], cb)
})

gulp.task('build-coffee', cb => {
  // pump([
  //   gulp.src(coffeeSrc),
  //   coffee({bare: true}),
  //   gulp.dest('./build/public/scripts/')
  // ], cb)

  return gulp.src('./src/coffeescript/app.coffee')
    .pipe(coffee({bare: true}))
    .pipe(gulp.dest('./build/public/scripts'))
})

gulp.task('build-sass', cb => {
  sass(sassSrc, {
    loadPath: ['./src/sass', 'node_modules/foundation-sites/scss']
  })
    .on('error', sass.logError)
    .pipe(concat('index.css'))
    .pipe(cssCondense())
    .pipe(gulp.dest('./build/public/stylesheets'))
})

gulp.task('build-pug', cb => {
  pump([
    gulp.src(pugSrc),
    pug(),
    gulp.dest('./build')
  ], cb)
})

gulp.task('watch', () => {
  gulp.watch(coffeeSrc, ['build-coffee'])
  gulp.watch(sassSrc, ['build-sass'])
  gulp.watch(pugSrc, ['build-pug'])
})

gulp.task('connect', () => {
  connect.server({
    root:'build',
    livereload: true
  })
})

gulp.task('build-assets', ['build-pug', 'build-sass', 'build-js-vendor', 'build-coffee'])

gulp.task('default', ['build-assets', 'connect', 'watch'])