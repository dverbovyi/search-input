var browserify = require('browserify'),
    gulp = require('gulp'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    source = require('vinyl-source-stream'),
    browserSync = require('browser-sync'),
    eventStream = require('event-stream'),
    replace = require('gulp-replace');

/* pathConfig*/
var srcPath = './app/',
    buildPath = './build/'
    browserDir = './',
    sassWatchPath = './app/**/*.scss',
    jsWatchPath = './app/**/*.js',
    htmlWatchPath = './app/**/*.html',
    files = [ // for multiple files bundle
        'app.js'
    ];



gulp.task('js', function () {
    var tasks = files.map(function (file) {
      console.log(file);
        return browserify(srcPath + file, {extensions: ['es6']})
            .transform("babelify", {presets: ["es2015"]})
            .bundle()
            .pipe(source(file))
            .pipe(gulp.dest(buildPath))
            .pipe(browserSync.reload({stream: true}));
    });

    return eventStream.merge.apply(null, tasks);
});

gulp.task('browser-sync', function () {
    const config = {
        server: {baseDir: browserDir}
    };

    return browserSync(config);
});

gulp.task('sass', function () {
    return gulp.src(sassWatchPath)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('/build/css'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', function () {
    gulp.watch(jsWatchPath, ['js']);
    gulp.watch(sassWatchPath, ['sass']);
    gulp.watch(htmlWatchPath, function () {
        return gulp.src('')
            .pipe(browserSync.reload({stream: true}))
    });
});

gulp.task('run', ['js', 'sass', 'watch', 'browser-sync']);

gulp.task('build', ['js', 'sass']);
