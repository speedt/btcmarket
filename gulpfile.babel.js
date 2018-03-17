/*!
 * zeroapp
 * Copyright(c) 2018 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var gulp = require('gulp');
var babel = require('gulp-babel');
var clean = require('gulp-clean');
var uglify = require('gulp-uglify');

gulp.task('clean', () => {
  return gulp.src('dist/*').pipe(clean({ force: true }));
});
