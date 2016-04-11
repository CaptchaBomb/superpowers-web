var gulp = require("gulp");

// TypeScript
var ts = require("gulp-typescript");
var tsProject = ts.createProject("src/tsconfig.json");
var tslint = require("gulp-tslint");

gulp.task("typescript", function() {
  var failed = false;
  var tsResult = tsProject.src()
    .pipe(tslint())
    .pipe(tslint.report("prose", { emitError: true }))
    .on("error", (err) => { throw err; })
    .pipe(ts(tsProject))
    .on("error", () => { failed = true; })
    .on("end", () => { if (failed) throw new Error("There were TypeScript errors."); });
  return tsResult.js.pipe(gulp.dest("src/"));
});

// Browserify
var browserify = require("browserify");
var source = require("vinyl-source-stream");
gulp.task("browserify", [ "typescript" ],function() {
  var bundler = browserify("./src/index.js");
  function bundle() { return bundler.bundle().pipe(source("index.js")).pipe(gulp.dest("../public")); }
  return bundle();
});

// All
gulp.task("default", [ "typescript", "browserify" ]);
