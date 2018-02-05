var gulp = require('gulp'),
		sass = require('gulp-sass'),
		bourbon = require("bourbon").includePaths,
		concat = require('gulp-concat'),
		uglify = require('gulp-uglifyjs'),
		autoprefixer = require('gulp-autoprefixer'),
		cssnano = require('gulp-cssnano'),
		rename = require("gulp-rename"),
		del = require("del"),
		iconfont = require('gulp-iconfont'),
		browserSync = require('browser-sync');


gulp.task('sass',function(){
	return gulp.src('app/sass/*.sass')
		.pipe(sass({
			sourcemaps: true,
			includePaths: [bourbon]
		}).on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 20 versions'],
			cascade: false
		}))
		.pipe(gulp.dest('app/css/'))
		.pipe(browserSync.stream());
});

gulp.task('ministyle', function(){
	return gulp.src('app/css/vendor.css')
	.pipe(cssnano())
	.pipe(rename({
		suffix: '.min'
	}))
	.pipe(gulp.dest('app/css/'))
});

gulp.task('browsersync', function() {
		browserSync.init({
				server: {
						baseDir: "app"
				},
				notify: false
		});
});

gulp.task('scripts', function(){
	return gulp.src([
		"app/libs/jquery/dist/jquery.min.js",
		'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js',
		'app/libs/owl.carousel/dist/owl.carousel.min.js',
		'app/libs/inputmask/dist/min/jquery.inputmask.bundle.min.js'
		])
	.pipe(concat('libs.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('app/js/'))
});

gulp.task('clean', function() {
	return del.sync('dist');
});

gulp.task('iconfont', function(){
  return gulp.src(['app/img/svg/*.svg'])
    .pipe(iconfont({
      fontName: 'svgicon',
      prependUnicode: true,
      formats: ['ttf', 'eot', 'woff', 'svg']
    }))
      .on('glyphs', function(glyphs, options) {
        // CSS templating, e.g.
        console.log(glyphs, options);
      })
    .pipe(gulp.dest('app/fonts/svgicon'));
});

gulp.task('watch',['browsersync','sass','scripts','ministyle'], function(){
	gulp.watch('app/sass/*.sass',['sass']);
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/js/*.js', browserSync.reload);
});

gulp.task('default',['watch']);


gulp.task('build',['clean','scripts','sass'],function(){
	var buildCss=gulp.src([
		'app/css/main.css',
		'app/css/vendor.min.css'
	]).pipe(gulp.dest('dist/css'));
	var buildJs=gulp.src('app/js/*.js').pipe(gulp.dest('dist/js'));
	var buildHtml=gulp.src('app/*.html').pipe(gulp.dest('dist'));
	var buildFonts=gulp.src('app/fonts/**/*.+(woff|woff2|svg|ttf|eot)').pipe(gulp.dest('dist/fonts'));
	var buildImage=gulp.src('app/img/**/*').pipe(gulp.dest('dist/img'));
});
