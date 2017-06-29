var gulp        = require('gulp'),
    autoprefixer= require('gulp-autoprefixer'),
    browserSync = require('browser-sync'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglifyjs'),
    cssnano     = require('gulp-cssnano'),
    rename      = require('gulp-rename'),
    del         = require('del'),
    imagemin    = require('gulp-imagemin'),
    pngquant    = require('imagemin-pngquant'),
    cache       = require('gulp-cache'),
    sftp        = require('gulp-sftp'),
    nodemon     = require('gulp-nodemon'),
    less        = require('gulp-less');

gulp.task('less', function () {
    return gulp.src('app/public/less/**/*.less')
        .pipe(less())
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8'], {cascade: true}))
        .pipe(gulp.dest('app/public/css'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('nodemon', function (cb) {
    var callbackCalled = false;
    return nodemon({script: 'app/circle.js'}).on('start', function () {
        if (!callbackCalled) {
            callbackCalled = true;
            cb();
        }
    });
});

gulp.task('browser-sync', ['nodemon'], function () {
   browserSync({
       logPrefix: 'circle',
       proxy: 'http://localhost:8080',
       notify: false
   });
});

gulp.task('css-libs', ['less'], function () {
   return gulp.src('app/public/css/libs.css')
       .pipe(cssnano())
       .pipe(rename({suffix: '.min'}))
       .pipe(gulp.dest('app/public/css'));
});

gulp.task('js-libs', function () {
    return gulp.src([
      'app/public/libs/jquery/dist/jquery.min.js'
    ])
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/public/js'))
});

gulp.task('clean', function () {
   return del.sync('dist');
});

gulp.task('clear-cache', function () {
    return cache.clearAll();
});

gulp.task('img', function () {
   return gulp.src('app/public/images/**/*')
       .pipe(cache(imagemin({
           interlaced: true,
           progressive: true,
           svgoPlugins: [{removeViewBox: false}],
           une: [pngquant()]
       })))
       .pipe(gulp.dest('dist/public/images'));
});

gulp.task('default', ['browser-sync', 'js-libs', 'css-libs'], function () {
    gulp.watch('app/public/styles/**/*.less', ['less']);
    gulp.watch('app/public/js/**/*.js', browserSync.reload);
    gulp.watch('app/public/circle.js', browserSync.reload);
    gulp.watch('app/views/**/*', browserSync.reload)
});

gulp.task('build', ['clean', 'img', 'less', 'js-libs'], function () {
    var buildCss = gulp.src([
        'app/public/css/core.css',
        'app/public/css/main.css'
    ])
        .pipe(cssnano())
        .pipe(gulp.dest('dist/public/css'));

    var buildCssLibs = gulp.src('app/public/css/libs.min.css')
        .pipe(cssnano())
        .pipe(gulp.dest('dist/public/css/'));

    var buildFonts = gulp.src('app/public/fonts/**/*.*')
        .pipe(gulp.dest('dist/public/fonts'));

    var buildJS = gulp.src('app/public/js/**/*.js')
        .pipe(gulp.dest('dist/public/js'));

    var buildViews = gulp.src('app/views/**/*.jade')
        .pipe(gulp.dest('dist/views'));

    var buildServer = gulp.src('app/circle.js')
        .pipe(gulp.dest('dist/'));
});

gulp.task('sftp', function () {
    return gulp.src('dist/**/*')
        .pipe(sftp({
            host: '174.138.61.250',
            user: 'root',
            pass: 'genka.ideas!',
            remotePath: '/root'
        }));
});
