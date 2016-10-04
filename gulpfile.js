var gulp = require('gulp');
var runSequence = require('run-sequence');
var ts = require('gulp-typescript');
var del = require('del');
var tslint = require('gulp-tslint');
const mocha = require('gulp-spawn-mocha');
var tsProject = ts.createProject('tsconfig.json');

gulp.task('clean', function () {
    return del('dist');
});

gulp.task('tsc', function () {
    var tsResult = tsProject.src() // instead of gulp.src(...) 
        .pipe(tsProject());

    return tsResult.js.pipe(gulp.dest('dist'));
});

gulp.task('tslint', function () {
    gulp.src('./src/defocusRule.ts')
        .pipe(tslint({
            formatter: 'verbose',
            configuration: 'tslint.json'
        }))
        .pipe(tslint.report({
            emitError: false,
            summarizedReportOutput: true
        }));
});

gulp.task('test', function () {
    return gulp
        .src('dist/**/*spec.js')
        .pipe(mocha());
});

gulp.task('default', function (done) {
    runSequence('clean', 'tsc', 'tslint', 'test', function () {
        done();
    });
});
