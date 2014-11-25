'use strict';

var gulp = require('gulp');

var eslint = require('gulp-eslint');
var add = require('gulp-add');
var filter = require('gulp-filter');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var cssmin = require('gulp-cssmin');
var uglify = require('gulp-uglify');

var conkitty = require('node-conkitty');


gulp.task('eslint', function() {
    return gulp.src(['gulpfile.js', 'pages/**/*.js', 'blocks/**/*.js'])
        .pipe(eslint({
            rules: {
                'quotes': [2, 'single'],
                'no-shadow-restricted-names': 0,
                'no-underscore-dangle': 0
            },
            env: {
                'node': true,
                'browser': true
            }
        }))
        .pipe(eslint.format());
});


gulp.task('conkitty', function() {
    var deps = conkitty.compile(['pages/index.ctpl']),
        cssFilter = filter('**/*.css'),
        jsFilter = filter('**/*.js');

    return gulp.src(deps)
        .pipe(cssFilter)
        .pipe(concat('|.css'))
        .pipe(cssmin())
        .pipe(cssFilter.restore())

        .pipe(jsFilter)
        .pipe(concat('|.js'))
        .pipe(uglify({preserveComments: 'some'}))
        .pipe(jsFilter.restore())

        .pipe(rename(function(path) { path.dirname += '/|'; }))
        .pipe(add('index.html', '<!doctype html>' + conkitty.applyTemplate('Index')))
        .pipe(gulp.dest('../'));
});


gulp.task('watch', function() {
    gulp.watch(['pages/**/*', 'blocks/**/*'], ['conkitty']);
});


gulp.task('default', ['eslint', 'conkitty', 'watch']);
