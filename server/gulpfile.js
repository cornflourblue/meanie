var gulp = require('gulp');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var argv = require('yargs').argv;

var basePath = '../client';

gulp.task('less', function () {
    compileLess('admin');
    compileLess('blog');

    function compileLess(app) {
        return gulp.src(basePath + '/' + app + '/_content/app.less')
            .pipe(less())
            .pipe(autoprefixer())
            .pipe(minifyCSS())
            .pipe(gulp.dest(basePath + '/' + app + '/_dist/'));
    }
});

gulp.task('scripts', function () {
    compileScripts('admin');
    compileScripts('blog');

    function compileScripts(app) {
        // include all .js files except for a couple of folders
        return gulp.src([
                basePath + '/' + app + '/**/*.js', 
                '!' + basePath + '/' + app + '/_content/**/*.js', 
                '!' + basePath + '/' + app + '/_dist/**/*.js'
            ])
            .pipe(ngAnnotate())
            .pipe(uglify())
            .pipe(concat('app.min.js'))
            .pipe(gulp.dest(basePath + '/' + app + '/_dist'));
    }
});

gulp.task('watch', function () {
    setupWatches('admin');
    setupWatches('blog');

    function setupWatches(app) {
        gulp.watch(basePath + '/' + app + '/_content/*.less', ['less']);
        gulp.watch([basePath + '/' + app + '/**/*.js', '!' + basePath + '/' + app + '/_dist/**/*.js'], ['scripts']);
    }
});

gulp.task('default', ['watch', 'scripts', 'less']);