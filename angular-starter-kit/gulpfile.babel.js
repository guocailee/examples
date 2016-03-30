'use strict';
import gulp from 'gulp';
import gutil from 'gulp-util';
import del from 'del';
import browserSync from 'browser-sync';
import gulpLoadPlugins from 'gulp-load-plugins';
import pkg from './package.json';
import packConfig from './webpack.config.js';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
const $ = gulpLoadPlugins();
const reload = browserSync.reload;
const webpackConfig = Object.create(packConfig);

// Lint JavaScript
gulp.task('lint', () =>
    gulp.src('app/scripts/**/*.js')
    .pipe($.eslint())
    .pipe($.eslint.format())
);
// Copy all files at the root level (app)
gulp.task('copy', () =>
    gulp.src([
        'app/**/*.html'
    ], {
        dot: true
    }).pipe(gulp.dest('build'))
    .pipe($.size({
        title: 'copy'
    }))
);

// Clean output directory
gulp.task('clean', cb => del(['.tmp', 'build/*', '!build/.git'], {
    dot: true
}));
gulp.task("webpack",['clean'], (callback) => {
    // run webpack
    webpack(webpackConfig, (err, stats) => {
        if (err) throw new $.util.PluginError("webpack", err);
        $.util.log("[webpack]", stats.toString({
            colors: true
        }));
        callback();
    });
});

gulp.task("webpack-dev-server", (callback) => {
    // Start a webpack-dev-server
    var compiler = webpack(webpackConfig);

    new WebpackDevServer(compiler, {
        publicPath: webpackConfig.output.publicPath,
        stats: {
            colors: true
        }
    }).listen(9000, "localhost", (err) => {
        if (err) throw new gutil.PluginError("webpack-dev-server", err);
        $.util.log("[webpack-dev-server]", "http://localhost:9000/webpack-dev-server/index.html");
    });
});
