var gulp = require('gulp')
var babel = require('gulp-babel')
var runSeq = require('run-sequence')
var notify = require('gulp-notify')
var livereload = require('gulp-livereload')
var plumber = require('gulp-plumber')
var eslint = require('gulp-eslint')
var sourcemaps = require('gulp-sourcemaps')
var concat = require('gulp-concat')
var browserify = require('browserify')
var source = require('vinyl-source-stream')
var babelify = require('babelify')
var lodash = require('gulp-lodash')

gulp.task('reload', function() {
	livereload.reload();
	console.log("Reload complete.")
})

gulp.task('lintJS', function() {

	return gulp.src(['./browser/js/**/*.js'])
		.pipe(plumber({
			errorHandler: notify.onError('Linting FAILED! Check your gulp process.')
		}))
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failOnError());
})

// Browserify task
gulp.task('browserify', function() {
	var bundleStream = browserify({
		entries: ['./browser/js/app.js'],
		debug: true
	})
		.transform(babelify.configure({
			presets: ["es2015"]
		}))
		.bundle()
		.pipe(source('core.js'));
	return bundleStream.pipe(gulp.dest('./public/js'));
});

gulp.task('watch', function() {
	livereload.listen()
	gulp.watch('browser/js/**', function() {
		runSeq('browserify', 'reload');
	});
	gulp.watch('server/**/*.js', ['lintJS']);
	gulp.watch(['./public/index.html'], ['reload']);
})

gulp.task('default', ['lintJS', 'browserify', 'watch'], function() {})
