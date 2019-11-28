'use strict';

const gulp = require('gulp'),
    path = require('path'),
    rename = require('gulp-rename'),
    browserify = require('browserify'),
    buffer = require('vinyl-buffer'),
    source = require('vinyl-source-stream');

let bundles = ['react', 'react-dom', 'react-dom/server', 'underscore', 'axios', 'history', 'path-to-regexp', 'sax'];

gulp.task('bundle-common', function() {
    const b = browserify({
        extensions: ['.jsx'],
        //entries: ['./ui/src/index.jsx']
    });

    b.transform('babelify', {
        extensions: ['.jsx', 'jsx'],
        presets: ['@babel/preset-env', '@babel/preset-react']
    });

    b.exclude(bundles);

    bundles.map( e => b.require(e) );

    b.require('./ui/src/index.jsx', {expose: 'simplified-ui'});

    return b.bundle()
        .pipe(source('common-bundle.js'))
        .pipe(gulp.dest('./ui'))
        .on( 'end', function() {
            return gulp.src('./ui/common-bundle.js')
                .pipe(gulp.dest('./public/js'));
        });
});

gulp.task('build-admin', function() {
    const b = browserify({
        extensions: ['jsx'],
        entries: ['./public/view-src/dom.jsx']
    });

    b.transform('babelify', {
        extensions: ['.jsx', 'jsx'],
        presets: ['@babel/preset-env', '@babel/preset-react']
    });

    b.exclude(['simplified-ui'].concat(bundles));

    return b.bundle()
        .pipe(source('dom.js'))
        .pipe(gulp.dest('./public/js'));
});