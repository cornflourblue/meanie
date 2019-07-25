const gulp = require('gulp');
const less = require('gulp-less');
const autoprefixer = require('gulp-autoprefixer');
const minifyCSS = require('gulp-clean-css');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const ngAnnotate = require('gulp-ng-annotate');

const scriptSrc = ['./src/**/*.js', '!./src/_assets/**/*'];
const cssSrc = ['./src/**/*.less', '!./src/_assets/**/*'];
const fileSrc = ['./src/**/*.html', './src/_assets/**/*'];

function scripts(cb) {
    gulp.src(scriptSrc)
        .pipe(babel({ presets: ['env'] }))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(concat('app.min.js'))
        .pipe(gulp.dest('./dist/_assets'));
    cb();
}

function css(cb) {
    gulp.src(cssSrc)
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(minifyCSS())
        .pipe(concat('app.min.css'))
        .pipe(gulp.dest('./dist/_assets'));
    cb();
}

function files(cb) {
    gulp.src(fileSrc, { base: 'src' })
        .pipe(gulp.dest('./dist'));
    cb();
}

function watch(cb) {
    gulp.watch(scriptSrc, scripts);
    gulp.watch(cssSrc, css);
    gulp.watch(fileSrc, files);
    cb();
}

exports.default = gulp.parallel(watch, scripts, css, files);