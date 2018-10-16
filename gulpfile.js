'use strict';
// Hello Gulp

var gulp         = require('gulp'),
	sass         = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	cleanCSS     = require('gulp-clean-css'),
	rename       = require('gulp-rename'),
	browserSync  = require('browser-sync').create(),
	concat       = require('gulp-concat'),
	uglify       = require('gulp-uglify'),
	sassLint = require('gulp-sass-lint');

gulp.task('browser-sync', ['styles', 'scripts'], function() {
	browserSync.init({
		server: {
			baseDir: "./app"
		},
		notify: true
	});
});

gulp.task('sass-lint', function() {
  return gulp.src('sass/*.sass')
      .pipe(sassLint({
        options: {
          formatter: 'stylish'
        },
        rules: {
          	'no-ids': 1,
            'no-color-keywords': 1,
            'no-mergeable-selectors': 1,
            'no-empty-rulesets': 1,
            'no-important': 1,
            'no-transition-all': 1,
            'quotes': 1,
            'no-vendor-prefixes': 1,
            'shorthand-values': 1,
            'no-color-literals': 1
      	}
      }))
      .pipe(sassLint.format())
      .pipe(sassLint.failOnError())
});

gulp.task('styles', function () {
	return gulp.src('sass/*.sass')
	.pipe(sass({
		includePaths: require('node-bourbon').includePaths
	}).on('error', sass.logError))
	.pipe(rename({suffix: '.min', prefix : ''}))
	.pipe(autoprefixer({browsers: ['last 15 versions'], cascade: false}))
	.pipe(cleanCSS())
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.stream());
});

gulp.task('scripts', function() {
	return gulp.src([
		'./libs/jquery/jquery.min.js',
		'./libs/aos/aos.js',
		'./libs/bootstrap4/dist/js/bootstrap.bundle.js',
		'./libs/Inputmask-4.x/dist/jquery.inputmask.bundle.js',
		'./libs/lazyimg/lazyimg.min.js',
		'./libs/fancybox/jquery.fancybox.js',
		'./libs/jquery.nicescroll.min.js',
		'./libs/config.js',
		])
		.pipe(concat('libs.js'))
		.pipe(uglify()) //Minify libs.js
		.pipe(gulp.dest('./app/js/'));
});

gulp.task('watch', function () {
	gulp.watch('sass/**/*.sass', ['styles']);
	gulp.watch('app/libs/**/*.js', ['scripts']);
	gulp.watch('sass/**/*.sass', ['sass-lint']);
	gulp.watch('app/js/*.js').on("change", browserSync.reload);
	gulp.watch('app/*.html').on('change', browserSync.reload);
});


gulp.task('default', ['browser-sync', 'watch']);
