import gulp from 'gulp'
import ts from 'gulp-typescript'
import browserify from 'browserify'
import source from 'vinyl-source-stream'
import tsify from 'tsify'


gulp.task(
  "default",
  gulp.series(function () {
    return browserify({
      basedir: ".",
      debug: true,
      entries: ["src/main.tsx"],
      cache: {},
      packageCache: {},
    })
      .plugin(tsify)
      .bundle()
      .pipe(source("bundle.js"))
      .pipe(gulp.dest("dist"));
  })
);