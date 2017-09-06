var gulp=require('gulp'),
	connect=require('gulp-connect'),
	livereload=require('gulp-livereload'),
	uglify=require('gulp-uglify'),
	gutil=require('gulp-util'),
	babel=require('gulp-babel'),
	minifyCSS=require('gulp-minify-css');

gulp.task('server',function(){
	connect.server({
		root:'src/',
		port:8002,
		livereload:true
	});
	livereload.listen();
});
//压缩JS
gulp.task('minJS',function(){
	gulp.src(['js/app.js'])
	.pipe(babel())
	.pipe(uglify())
	.on('error',function(err){gutil.log(gutil.colors.red('[Error]'),err.toString());})
	.pipe(gulp.dest('../dist/js/'));

});
//压缩CSS
gulp.task('minCSS',function(){
	gulp.src('css/style.css')
	.pipe(minifyCSS())
	.pipe(gulp.dest('../dist/css/'));
});


gulp.watch(['src/css/style.css','src/js/app.js','src/index.html'],function(e){
	livereload.changed(e.path);
});
gulp.task('default',['server']);