/*var gulp = require('gulp');
var gulpConnect = require('gulp-connect');

gulp.task('watchsub3',function(){
  gulp.watch('*.*',function(event){
      console.log(event.path+' ' + event.type);
  })    
})
gulp.task('server', function() {
  gulpConnect.server({
    root: 'bin',
    livereload: true
  });
});*/

var gulp = require('gulp');
//var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');


// gulp.task('default', ['browser-sync'], function () {
// });

// gulp.task('browser-sync', ['nodemon'], function() {
// 	browserSync.init(null, {
// 		proxy: "http://localhost:5000",
//         files: ["public/**/*.*"],
//         browser: "google chrome",
//         port: 7000,
// 	});
// });
gulp.task('nodemon', function (cb) {
	
	var started = false;
	
	return nodemon({
    script: './bin/www',
    watch: ['*.*']
	}).on('start', function () {
		// to avoid nodemon being started multiple times
		// thanks @matthisk
		if (!started) {
			cb();
			started = true; 
		} 
	});
});