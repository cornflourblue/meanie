const gulp = require('gulp');
const less = require('gulp-less');
const autoprefixer = require('gulp-autoprefixer');
const minifyCSS = require('gulp-clean-css');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const ngAnnotate = require('gulp-ng-annotate');

function scripts(cb) {
    gulp.src('./src/**/*.js')
        .pipe(babel({ presets: ['env'] }))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(concat('app.min.js'))
        .pipe(gulp.dest('./dist'));
    cb();
}

function css(cb) {
    gulp.src('./src/**/*.less')
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(minifyCSS())
        .pipe(concat('app.min.css'))
        .pipe(gulp.dest('./dist'));
    cb();
}

function files(cb) {
    gulp.src(['./src/**/*.html', './src/_assets/**/*'], { base: 'src' })
        .pipe(gulp.dest('./dist'));
    cb();
}

function watch(cb) {
    gulp.watch('./src/**/*.js', scripts);
    gulp.watch('./src/**/*.less', css);
    gulp.watch('./src/**/*.html', files);
    cb();
}

exports.default = gulp.parallel(watch, scripts, css, files);