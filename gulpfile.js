const { series,parallel,src,dest,watch } = require('gulp');
var del = require('del')
var ts = require('gulp-typescript')
// var browserify = require("browserify");
// var source = require("vinyl-source-stream");
// var tsify = require("tsify");
const rollup = require('rollup');
const rollupTypescript = require('@rollup/plugin-typescript');
var  nodeResolve =  require('@rollup/plugin-node-resolve').nodeResolve

var tsProject = ts.createProject('tsconfig.json',{});

function clean(cb) {
    del('./dist/**/*').then(() => {
        cb();
    })
  }
  
function transpile(cb) {
    // tsProject.src().pipe(tsProject()).js.pipe(dest('./dist'))

    rollup.rollup({
        input:'./src/main.ts',
        plugins:[
            rollupTypescript(),
            nodeResolve(),
        ]
    }).then(bundle => {
        return bundle.write({
            file: './dist/bundle.js',
            format: 'umd',
            name: 'library',
            sourcemap: true
        });
    });

    cb();
}

function livereload(cb) {
// body omitted
    cb();
}
  
  
exports.transpile = transpile;
exports.default = function(){
    watch('src/*.ts', { ignoreInitial: false },series(clean, transpile))
}