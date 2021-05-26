const { series,parallel,src,dest,watch } = require('gulp');
let del = require('del')
let ts = require('gulp-typescript')
let browserify = require("browserify");
let source = require("vinyl-source-stream");
let tsify = require("tsify");
let sourcemaps = require("gulp-sourcemaps");
let buffer = require("vinyl-buffer");

// const rollup = require('rollup');
// const rollupTypescript = require('@rollup/plugin-typescript');
// let  nodeResolve =  require('@rollup/plugin-node-resolve').nodeResolve

let tsProject = ts.createProject('tsconfig.json',{});

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
    .on('error', function (err) {
        console.log(err.toString());

        this.emit('end');
    })
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
    watch(['src/**/*.{ts,tsx}'], { ignoreInitial: false },series(clean, transpile))
}