/// <reference path='../../../typings/modules/chai/index.d.ts' />

import * as Lint from "tslint/lib/lint";
import {expect} from "chai/lib/chai";

export function testScript(rule: string, scriptText: string, config: Object): boolean {
    const options: Lint.ILinterOptions = {
        configuration: config,
        formatter: 'json',
        formattersDirectory: 'dist/formatters/',
        rulesDirectory: 'dist/'
    };

    const linter = new Lint.Linter(`${rule}.ts`, scriptText, options);
    const result = linter.lint();

    const failures = JSON.parse(result.output);

    return failures.length === 0;
}

const rule = 'defocus';
const codeSnippets: string[] = [
    'fdescribe(() => { console.log("testing") });',
    'describe(() => { fit(() => { console.log("testing)}) });',
    'const test = { test: 123 }',
    'const fdescribe = { test: 123 }',
    'let testObject = { fit: "test", test: "fit" }',
    'function(fdescribe, fit){ console.log(fdescribe, fit); }();'
];

describe(rule, function test() {

    const tsLintConfig = {rules: {'defocus': [true]}};

    it('should fail when "fdescribe" is called', function () {
        const code = codeSnippets[0];
        const result = testScript(rule, code, tsLintConfig);
        expect(result).to.equal(false, code);
    });

    it('should fail when "fit" is called', function () {
        const code = codeSnippets[1];
        const result = testScript(rule, code, tsLintConfig);
        expect(result).to.equal(false, code);
    });

    it('should not fail for a snippet without "fit" or "fdescribe"', function () {
        const code = codeSnippets[2];
        const result = testScript(rule, code, tsLintConfig);
        expect(result).to.equal(true, code);
    });

    it('should not flag a false alert if "fdescribe" appears as a variable name', function () {
        const code = codeSnippets[3];
        const result = testScript(rule, code, tsLintConfig);
        expect(result).to.equal(true, code);
    });

    it('should not flag a false alert if "fit" appears as a object property key or value', function () {
        const code = codeSnippets[4];
        const result = testScript(rule, code, tsLintConfig);
        expect(result).to.equal(true, code);
    });

    it('should not flag a false alert if "fdescribe" or "fit" appear as function parameters ', function () {
        const code = codeSnippets[5];
        const result = testScript(rule, code, tsLintConfig);
        expect(result).to.equal(true, code);
    });
});
