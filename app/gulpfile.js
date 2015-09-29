/**
 *  Requires
 **/
var gulp = require('gulp');
var ts = require('gulp-typescript');
var concat = require('gulp-concat');
var replace = require('gulp-replace');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var inject = require('gulp-inject');
var ngHtml2Js = require("gulp-ng-html2js");
var htmlmin = require("gulp-htmlmin");

/**
 * Variables for compiling base library
 **/
var base = {
    src : require('./vendor.base.json'),
    name : 'vendor.base.js',
    dest : 'dist',
    vendor_file : 'vendor.base.json'
};

/**
 * Variables for compiling typescript src
 */
var app = {
    name : 'stocking.js',
    modules : 'src/modules/**/*.ts',
    src : 'src/**/*.ts',
    base : "src/**/base-*.ts",
    dest : 'dist',
    definitions : 'typings/tsd/**/*.ts',
    custom_definitions : 'typings/custom/custom.d.ts',
    views : 'src/**/*.html',
    app : 'src/*.ts'
};

/**
 * Concat all html files into a JS file and bundle them in angular module 'app.views'
 * This allow us to never load html partial async and optimize performance
 */
gulp.task('concat-html',function(){
    return gulp.src(app.views)    
    .pipe(htmlmin({
        keepClosingSlash: true,
        removeComments : true,
        collapseWhitespace : true
    }))
    .pipe(ngHtml2Js({
        moduleName: "app.views"
    }))    
    .pipe(concat("stocking.views.js"))
    .pipe(uglify())
    .pipe(gulp.dest("./dist"));
}); 

/**
 * Watch the src files and build it if they change
 * Watch the vendor.base.js - concat again if it changes
 */
gulp.task('do-watch',function() {
    gulp.watch(app.src,['build-src','build-tsconfig']);
    gulp.watch(base.vendor_file,['build-base', 'build-tsconfig']);
    //gulp.watch(app.views,['concat-html']);
})


/**
 * Put all base libraries (angular, jquery, etc.) into a single js file
 */
gulp.task('build-base', function() {
    return gulp.src(base.src)
        .pipe(uglify())
        .pipe(concat(base.name))
        .pipe(gulp.dest(base.dest));
});

/**
 * Compile the src - dynamically replace the api endpoint and set timestamp on things that needs not to be cached
 */
gulp.task('build-src', function () {
    console.log("BUILDING")
    var tsResult = gulp.src([app.base,app.app,app.modules,app.src,app.definitions,app.custom_definitions])
        .pipe(ts({
            noImplicitAny: false,
            removeComments : false,
            noExternalResolve : true,
            target: 'ES5'
        }))
    return tsResult.js
        .pipe(replace('__DATE__', new Date().getTime()))
        .pipe(ngAnnotate())
        .pipe(concat(app.name))        
        .pipe(gulp.dest(app.dest));
});

/**
 * Constructs the tsconfig file.
 * Put a reference to all our files + 3rd party declaration files in it
 */
gulp.task('build-tsconfig', function(){
    var target = gulp.src('tsconfig.json');
    //IMPORTANT - app.custom_definitions must go last as it is used to NOT put comma on the last row in tsconfig.json
    var sources = gulp.src([app.base,app.app,app.src,app.definitions,app.custom_definitions], {read: false});
    return target.pipe(inject(sources, {
       starttag: '"files" : [',
        endtag: ']',
        transform: function (filepath) {            
            filepath = filepath.substring(1,filepath.length)
            var entry = '"' + filepath + '"';
            if(filepath.indexOf('custom/custom.d.ts') == -1)
                entry += ','
            return entry;
        }
    })).pipe(gulp.dest('./'));
});

/**
 * Executes when running "gulp"
 * Does:
 * 1. construct tsconfig.json
 * 2. concat and minify vendor.base.js
 * 3. compile the bounty.js
 * 4. compile test and watch for src changes
 */
gulp.task('default',['build-tsconfig', 'build-base','build-src','do-watch']);

gulp.task('fast',['build-src','do-watch']);

/**
 * Compiles and executes the tests
 * This task should be used by the build server 
 */
gulp.task('test',['build-test','run-test']);

/**
 * Continues run tests
 */
gulp.task('watch-test',['build-test','do-watch-test']); 


/**
 * Used by JENKINS to compile for production
 */
gulp.task('prod',['build-tsconfig','build-base','build-src','build-test', 'concat-html']);
