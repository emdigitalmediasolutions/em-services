/* jshint esversion: 6 */ 
/* jshint strict: false */ 
/* jshint unused: false */ 
/* jshint loopfunc: true */ 

require('dotenv').config();

const { series, src, dest, watch } = require('gulp');
const del = require('del');
const path = require('path');
const zip = require('gulp-zip');

const pluginPath = process.env.EMSERVICES_TEST_PATH;

function cleanTest(cb) {
    del([path.join(pluginPath, '*')], {force: true})
    .catch(function(err) {
        console.log(err);
    })
    .then(function() {
        cb();
    });
}

function deployTest() {
    return src([path.join('**/*.*'), '!' + path.join('node_modules/**/*.*'), '!' + path.join('dist/**/*.*')])
    .pipe(dest(pluginPath));
}

function watchTest(cb) {
    watch('*.*', exports.deployTest);
    watch('build/**/*.*', exports.deployTest);
    cb();
}

function bundle() {
    return src([path.join('**/*.*'), '!' + path.join('node_modules/**/*.*'), '!' + path.join('dist/**/*.*')])
    .pipe(zip('em-services.zip'))
    .pipe(dest('dist'));
}

exports.cleanTest = cleanTest;
exports.deployTest = series(cleanTest, deployTest);
exports.watchTest = series(cleanTest, deployTest, watchTest);
exports.bundle = bundle;