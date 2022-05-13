const gulp = require('gulp')
const concat = require('gulp-concat')
const cssmin = require('gulp-cssmin')
const rename = require('gulp-rename')
const uglify = require('gulp-uglify')
const image = require('gulp-imagemin')
const stripJs = require('gulp-strip-comments')
const stripCss = require('gulp-strip-css-comments')
const htmlmin = require('gulp-htmlmin')
const {series, parallel } = require('gulp')
const babel = require('gulp-babel')
const browserSync = require('browser-sync')
const browser = require('browser-sync').create()
const reload = browserSync.reload

function tarefasCSS(cb) {

    return gulp.src(['./node_modules/bootstrap/dist/css/bootstrap.css',
                     './vendor/owl/css/owl.css',
                     './vendor/fontawesome/fontawesome.css',
                    './src/css/style.css' ])
        .pipe(stripCss())       
        .pipe(concat('styles.css'))
        .pipe(cssmin())
        .pipe(rename({ suffix: '.min'})) // libs.min.css
        .pipe(gulp.dest('./dist/css'))

}

function tarefasJS(callback){

    gulp.src(['./vendor/jquery/jquery-3.6.0.min.js',
                    './node_modules/jquery/dist/jquery.js',
                    './node_modules/bootstrap/dist/js/bootstrap.js',
                    './vendor/owl/js/owl.js',
                    './src/js/custom.js'])
        .pipe(babel({ comments:false,presets: ['@babel/env']}))            
        .pipe(concat('scripts.js'))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min'})) //libs.min.js
        .pipe(gulp.dest('./dist/js'))
    return callback()
}


function tarefasImagem(){
    
    return gulp.src('./src/images/*')
        .pipe(image({
            pngquant: true,
            optipng: false,
            zopflipng: true,
            jpegRecompress: false,
            mozjpeg: true,
            gifsicle: true,
            svgo: true,
            concurrent: 10,
            quiet: true
        }))
        .pipe(gulp.dest('./dist/images'))
}

function tarefasHTML(callback){
    gulp.src('./src/**/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('./dist'))
    return callback()
}

gulp.task('serve',function(){
    browserSync.init({
        server:{baseDir:"./dist"}
    })
    gulp.watch('./src/**/*').on('change',process)
    gulp.watch('./src/**/*').on('change',reload)
})
   
  
function end(cb){
    console.log('tarefas concluidas')
    return cb()
}



const process = series(tarefasHTML,tarefasCSS,tarefasJS,end)

exports.styles = tarefasCSS
exports.scripts = tarefasJS
exports.images = tarefasImagem


exports.default=process