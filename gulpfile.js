'use strict'

const gulp = require('gulp')
const gutil = require('gulp-util')
const plumber = require('gulp-plumber')
const ejs = require('gulp-ejs')
const connect = require('gulp-connect')
const livereload = require('gulp-livereload')
const changed = require('gulp-changed')
const stylus = require('gulp-stylus')
const nib = require('nib')
const minifycss = require('gulp-minify-css')
const config = require('./config/config.json')

const filesToWatch = ['./build/**/*.{html,css,js}']

gulp.task('files', () => {
  gulp.src(filesToWatch)
    .pipe(livereload())
})

gulp.task('ejs', () => {
  const options = { config }
  const settings = { ext: '.html' }
  return gulp.src('./src/ejs/{index,univille/index}.ejs')
    .pipe(ejs(options, settings))
    .on('error', gutil.log)
    .pipe(gulp.dest('./build'))
})

gulp.task('stylus', () => {
  gulp.src('./src/stylus/style.styl')
    .pipe(plumber())
    .pipe(stylus({
      set: ['compress'],
      use: [nib()]
    }))
    .pipe(minifycss())
    .pipe(gulp.dest('./build/css'))
})

gulp.task('scripts', () => {
  const jsDest = './build/scripts'
  gulp.src('./src/scripts/*')
    .pipe(changed(jsDest))
    .pipe(gulp.dest(jsDest))
})

gulp.task('copy', () => {
  const imagesDest = './build/images'
  gulp.src('./src/images/**/*')
    .pipe(changed(imagesDest))
    .pipe(gulp.dest(imagesDest))
})

gulp.task('watch', () => {
  livereload.listen()
  gulp.watch('src/ejs/**/*.ejs', ['ejs', 'copy'])
  gulp.watch('src/stylus/**/*.styl', ['stylus', 'copy'])
  gulp.watch('src/scripts/*', ['scripts', 'copy'])
  gulp.watch('src/images/**/*', ['copy'])
  gulp.watch(filesToWatch, ['files'])
})

gulp.task('build', ['ejs', 'stylus', 'scripts', 'copy'])

gulp.task('webserver', ['build'], () => {
  connect.server({
    root: 'build',
    livereload: true,
    port: process.env.PORT || 8080
  })
})

gulp.task('default', ['webserver', 'watch'])
