var gulp = require('gulp'); //Gulp
var clean = require('gulp-clean'); //Del a directory
var concat = require('gulp-concat'); // Concat Files
var uglify = require('gulp-uglify'); // Minify JavaScript
var streamqueue = require('streamqueue'); //Makes possible merge gulp.src()
var htmlmin = require('gulp-htmlmin'); //Minify HTML
var cleanCSS = require('gulp-cleancss'); //Minify CSS
var sass = require('gulp-sass'); //Convert SASS/SCSS to CSS
var runSequence = require('run-sequence'); // Run Gulp tasks in sequence
var imagemin = require('gulp-imagemin');
var changed  = require('gulp-changed');

//Generate Icon Fonts
var iconfont = require('gulp-iconfont');
var runTimestamp = Math.round(Date.now()/1000);
var iconfontCss = require('gulp-iconfont-css');
var fontName = 'ng-icons';

gulp.task('iconfonts', function(){
	return gulp.src(['assets/icons/*.svg'])
	    .pipe(iconfontCss({
	      fontName: fontName,
	      path: 'assets/icons/_template.scss',
	      targetPath: '../sass/icons.scss',
	      fontPath: '../fonts/'
	    }))
	    .pipe(iconfont({
	      fontName: fontName,
	      apprendCodepoints: true
	     }))
	    .pipe(gulp.dest('assets/fonts'));
});

//Dist - Clean Dist dir Task
gulp.task('clean', function(){
    return gulp.src('dist/')
        .pipe(clean());
});

//Dist - HTML Minify Task
gulp.task('htmlmin', function(){
    return gulp.src('view/*.html')
    	.pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('dist/view'));
});

//Dist - Compile Images
gulp.task('jpg', function() {
    gulp.src('./assets/img/**/*.jpg')
        .pipe(changed('./dist/assets/img/'))
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('./dist/assets/img/'));
});
//

//Dev - Convert Sass to CSS
gulp.task('sass-to-css', function(){
	console.log('TESTE');
	return gulp.src('assets/sass/application.scss')
		.pipe(sass())
		.pipe(cleanCSS())
		.pipe(gulp.dest('assets/css/'))
		.pipe(gulp.dest('dist/assets/css/'));
});

//Dist - JS Clean Task
gulp.task('cleanJS', function() {
	return streamqueue({ objectMode: true },
			gulp.src(['lib/angular/angular.min.js', 'lib/angular-route/angular-route.min.js']),
			gulp.src(['js/**/*.js']).pipe(concat('scripts.js')).pipe(uglify())
		)
		.pipe(concat('all.min.js'))
		.pipe(gulp.dest('dist/js/'))
		.pipe(gulp.dest('js/'));
});

//Watch Task: Watches SASS
gulp.task('watch', function(){
	gulp.watch('assets/sass/*.scss', ['sass-to-css'])
	gulp.watch('assets/icons/*.svg', ['iconfonts'])
});

//Copy Task: Copy Files
gulp.task('copy', function() {
	return gulp.src('index.html')
		.pipe(htmlmin({collapseWhitespace: true}))
		.pipe(gulp.dest('dist/'));
});

//Default Task
gulp.task('default', function(cb){
    return runSequence('clean', ['htmlmin', 'cleanJS', 'watch', 'copy'], cb);
    console.log(cb);
});
