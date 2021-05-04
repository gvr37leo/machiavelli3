const { series,parallel,src,dest,watch } = require('gulp');
var del = require('del')
var ts = require('gulp-typescript')
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var tsify = require("tsify");
var sourcemaps = require("gulp-sourcemaps");
var buffer = require("vinyl-buffer");

// const rollup = require('rollup');
// const rollupTypescript = require('@rollup/plugin-typescript');
// var  nodeResolve =  require('@rollup/plugin-node-resolve').nodeResolve

var tsProject = ts.createProject('tsconfig.json',{});

function clean(cb) {
    del('./dist/**/*').then(() => {
        cb();
    })
  }
  
function transpile(cb) {
    // tsProject.src().pipe(tsProject()).js.pipe(dest('./dist'))
    browserify({
        basedir: ".",
        debug: true,
        entries: ["src/main.tsx"],
        cache: {},
        packageCache: {},
    })
    .plugin(tsify)
    .transform("babelify", {
        presets: ["es2015","react"],
        extensions: [".ts",".tsx"],
    })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write("./"))
    .pipe(dest('dist'))
    // rollup.rollup({
        
    //     input:'./src/main.tsx',
    //     plugins:[
    //         nodeResolve(),
    //         rollupTypescript(),
    //     ]
    // }).then(bundle => {
    //     return bundle.write({
    //         file: './dist/bundle.js',
    //         format: 'umd',
    //         name: 'library',
    //         sourcemap: true
    //     });
    // });

    cb();
}

function livereload(cb) {
// body omitted
    cb();
}
  
  
exports.transpile = transpile;
exports.default = function(){
    watch(['src/*.{ts,tsx}'], { ignoreInitial: false },series(clean, transpile))
}