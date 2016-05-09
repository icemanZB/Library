var gulp = require('gulp');
//var gutil = require('gulp-util');
//var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var seajsCombo = require('gulp-seajs-combo');

/*gulp.task('concat', function () {
	gulp.src('js/!*.js')
		.pipe(uglify())
		.pipe(concat('all.min.js'));
	// .pipe(gulp.dest('build'));
});*/

gulp.task('seajscombo', function () {

	return gulp.src('./build/c.js')

		.pipe(seajsCombo())

		.pipe(gulp.dest('build/dist'));

});

/*
 var gulp = require('gulp');
 var cmdPack = require('gulp-cmd-pack');
 var uglify = require('gulp-uglify');

 gulp.task('default', function () {
 gulp.src('build/c.js') //main文件
 .pipe(cmdPack({
 mainId: 'dist/c', //初始化模块的id
 base  : 'build/', //base路径
 }))
 // .pipe(uglify())
 .pipe(gulp.dest('build/dist'));//输出到目录
 });*/
