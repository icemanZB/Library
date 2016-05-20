var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var seajsCombo = require('gulp-seajs-combo');
var clean = require('gulp-clean');
var gulpCopy = require('gulp-file-copy');
var cmdPack = require('gulp-cmd-pack');

gulp.task('clean', function () {
	return gulp.src(['.build', 'js/hellosea/dist'], {read: false})
		.pipe(clean());
});

// var cmdWrap = require('gulp-cmd-wrap');
// gulp.task('cmd', function () {
// 	gulp.src('js/hellosea/src/a.js')
// 		.pipe(cmdPack({
// 			mainId: 'dist/a',
// 			base  : 'js/hellosea/src'
// 		}))
// 		.pipe(gulp.dest('js/hellosea/dist/'));
// });

// gulp.task('cmd', function () {
// 	gulp.src('js/hellosea/src/a.js') // main 文件
// 		// .pipe(cmdPack({
// 		// 	mainId: 'app', //初始化模块的id
// 		// 	base  : 'path/to/module/', //base路径
// 		// 	alias : {
// 		// 		dialog         : '../../bower_components/art-dialog/dist/dialog-plus-min.js',
// 		// 		customScrollBar: '../../bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.min.js'
// 		// 	},
// 		// 	ignore: ['bootstrap'] //这里的模块将不会打包进去
// 		// }))
// 		// .pipe(uglify({ //压缩文件，这一步是可选的
// 		// 	mangle: {
// 		// 		except: ['require']
// 		// 	}
// 		// }))
// 		.pipe(gulp.dest('path/dist/'));//输出到目录
// });

gulp.task('seajscombo', function () {

 return gulp.src('js/hellosea/src/a.js')

 .pipe(seajsCombo())

 //.pipe(uglify())

 .pipe(gulp.dest('js/hellosea/dist'));

 });



/*gulp.task('copy', function () {
 // "js/hellosea/dist/a.js": ["js/hellosea/src/a.js"]
 var start = 'js/hellosea/dist/';

 gulp.src(start)
 .pipe(gulpCopy('js/hellosea/src/', {
 start: start
 }))

 });*/

/*gulp.task('concat', function () {
 gulp.src('js/!*.js')
 .pipe(uglify())
 .pipe(concat('all.min.js'));
 // .pipe(gulp.dest('build'));
 });*/



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
 });
 */
