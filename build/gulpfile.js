const gulp = require('gulp'),
	  ts = require("gulp-typescript"),
      browserify = require('browserify'),
      gulpif = require('gulp-if'),
      rename = require('gulp-rename'),                      // 文件重命名 
      concat = require('gulp-concat'),                      // 文件合并
      cache = require('gulp-cache'),
      del = require('del'); 

// JS ES6
const source = require('vinyl-source-stream'),
	  watchify = require("watchify"),
	  tsify = require('tsify'),
	  uglify = require('gulp-uglify'),                     // 代码混淆
      gutil = require("gulp-util"),
      sourcemaps = require('gulp-sourcemaps'),
      buffer = require('vinyl-buffer'),
      tsProject = ts.createProject("tsconfig.json"),
      babel = require('gulp-babel');

// CSS
const sass = require('gulp-sass'),
	  minifyCss = require('gulp-minify-css'),
	  autoprefixer = require('gulp-autoprefixer');

// IMG
const imagemintinypng = require('gulp-tinypng'),          // tinypng图片压缩
      tinyKey = "x_6kBmY-hoXpd7Eg9CchBpFVVH5L9yIf";
      // tinify = require("tinify");
      // tinify.key = "x_6kBmY-hoXpd7Eg9CchBpFVVH5L9yIf";

const imagemin = require('gulp-imagemin'),     
      pngquant = require('imagemin-pngquant');            // 常规图片压缩插件

// HTML
const minifyHtml = require('gulp-minify-html');

// 浏览器                  
const browserSync = require('browser-sync').create();

const nmsrc = 'node_modules/';

// 路径
let paths = {
    pages: ['src/*.html'],
    css: ['src/css/*.scss'],
    js: [
        'src/js/animate.js',
        'src/js/hero.js',
        'src/js/barriers.js',
        'src/js/element.js',
        'src/js/star.js',
        'src/js/create.js',
        'src/js/main.js'
    ],
    vendor: ['src/js/vendor/jquery.min.js', 'src/js/vendor/jquery.transit.js', 'src/js/vendor/swiper.min.js', 'src/js/vendor/rem.js', 'src/js/vendor/common.js', 'src/js/vendor/fetch.js'],
    img: ['src/img/*.{png,jpg,gif,ico}', 'src/img/*/*.{png,jpg,gif,ico}']
};


// 是否混淆代码
let condition = false;





gulp.task('miniImg', function(){
    return gulp.src(paths.img)
    .pipe(imagemin({
        optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
        progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
        interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
        multipass: true, //类型：Boolean 默认：false 多次优化svg直到完全优化
        svgoPlugins: [{removeViewBox: false}], //不要移除svg的viewbox属性
        use: [pngquant({quality: '60'})] //使用pngquant来压缩png图片
    }))
    .pipe(gulp.dest('dist/img'));
    //.pipe(browserSync.stream());
});

gulp.task('miniImg-tiny', function(){
    return gulp.src(paths.img)
    .pipe(cache(imagemintinypng(tinyKey, {
        'optimizationLevel': 5, 
        'progressive': true, 
        'interlaced': true
    })))
    .pipe(gulp.dest('dist/img'));
    //.pipe(browserSync.stream());
});

gulp.task('miniJs', function(){
    return gulp.src(paths.js)
        .pipe(concat('bundle.js'))                  //合并所有js到main.js
        .pipe(gulpif(
            condition, 
            uglify(),
            rename({suffix: '.min'})
        ))
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.stream());
});

gulp.task('miniVendorJs', function(){
    return gulp.src(paths.vendor)
        .pipe(concat('bundle-vendor.js'))                  //合并所有js到main.js
        .pipe(gulpif(
            condition, 
            uglify(),
            rename({suffix: '.min'})
        ))
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.stream());
});


// CSS 编译
gulp.task('miniCss', function(){
    return gulp.src(paths.css)
    .pipe(concat('bundle.css'))                // 合并所有css到main.css
    .pipe(sass())
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false,
        remove: false       
    }))
    .pipe(gulpif(
        condition, 
        minifyCss({                 
            compatibility: 'ie7'
        }), 
        rename({suffix: '.min'})
    ))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
});

// HTML 编译
gulp.task('miniHtml', function () {
    return gulp.src(paths.pages) // 'src/rev/**/*.json'
    .pipe(gulpif(
        condition, minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        })
    ))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
});


//意外出错？清除缓存文件
gulp.task('clean', function(cb) {
    del(['./dist/img/'], cb),
    del(['./dist/js/'], cb),
    del(['./dist/css/'], cb)
});


// 任务执行
gulp.task("default", function(){
    browserSync.init({
        port: 9001,
        server: {
            baseDir: ['./dist']
        }
    })
    
	gulp.start(['miniHtml', 'miniCss', 'miniImg', 'miniJs', 'miniVendorJs']);
	gulp.watch(paths.pages, ['miniHtml']);
    gulp.watch(paths.css, ['miniCss']);
    gulp.watch(paths.img, ['miniImg']);
    gulp.watch(paths.js, ['miniJs']);
    gulp.watch(paths.vendor, ['miniVendorJs']);
    // gulp.watch(paths.js, ['miniJs', 'miniBaseJs']);
});








