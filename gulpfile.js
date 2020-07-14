var gulp = require('gulp');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var util = require('gulp-util');
var ngAnnotate = require('gulp-ng-annotate');
var argv = require('yargs').argv;

var basePath = './client';
var isProduction = !!util.env.production

gulp.task('vendor_css', function () {
    return gulp.src([
        //'node_modules/bootstrap/dist/css/bootstrap.min.css',
        ])
        .pipe(gulp.dest(basePath + '/_dist'));
});

gulp.task('less', function () {
    compileLess('admin');
    compileLess('blog');

    function compileLess(app) {
        return gulp.src([
            basePath + '/' + app + '/_content/app.less'
            ])
            .pipe(less())
            .pipe(autoprefixer())
            .pipe(isProduction ? minifyCSS() : util.noop())
            .pipe(gulp.dest(basePath + '/' + app + '/_dist/'));
    }
});

//angular-ui-router@0.2.18: This npm package 'angular-ui-router' has been renamed to '@uirouter/angularjs'.


gulp.task('vendor_scripts', function () {
    gulp.src([
        'node_modules/underscore/underscore-min.js',
        'node_modules/moment/min/moment.min.js',
        'node_modules/ckeditor/adapters/jquery.js',
        'node_modules/jquery/dist/jquery.min.js',
        //jquery-ui-dist needs multiple files, so serve from node_modules
        //'node_modules/jquery-ui-dist/jquery-ui.min.js',
        'node_modules/angular/angular.min.js',
        'node_modules/angular-messages/angular-messages.min.js',
        'node_modules/@uirouter/angularjs/release/angular-ui-router.min.js'
    ])
    .pipe(gulp.dest(basePath + '/_dist'));

    //serve ckeditor directly from node_modules folder

    //ckeditor jqueryui adapter file has same filename as jqueryui
    //so needs to go in a different directory
    //gulp.src([
    //    'node_modules/ckeditor/adapters/jquery.js'
    //])
    //.pipe(gulp.dest(basePath + '/_dist/ckeditor/adapters'));
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
            .pipe(isProduction ? uglify() : util.noop())
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

gulp.task('default', ['scripts', 'less', 'vendor_scripts', 'vendor_css']);
