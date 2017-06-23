var gulp = require('gulp')
var webpack = require("webpack")
var run = require('gulp-run')
var webpackConfig = require('./webpack.config.js')
var winInstaller = require('electron-windows-installer');

var isWatch = true

gulp.task('default', ()=> {
    run('electron .').exec()
    gulp.start('webpack');
}) 

gulp.task('webpack', function(callback) {
    var config = Object.assign(webpackConfig, {
        watch: isWatch
    })
    webpack(webpackConfig, function(err, stats) {
        console.log(stats.toString());
    });
})
 
gulp.task('installer', function(done) {
    winInstaller({appDirectory: './SwitchHost-win32-x64', outputDirectory: './release'})
        .then(done)
        .catch(done);
});