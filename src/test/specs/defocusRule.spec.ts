import {expect} from "chai";
import * as fs from "fs";
import * as path from "path";
import * as ts from "typescript";
import * as Lint from "tslint";;

import {Rule} from "../../defocusRule";

const ruleName = 'defocus';

const ruleOptions: Readonly<Lint.IOptions> = {
    disabledIntervals: [],
    ruleArguments: [],
    ruleName,
    ruleSeverity: "error"
};

describe(ruleName, function test() {

    it('should fail when "fdescribe" is called', () => {
        const sourceFile = getSourceFile('shouldFailWhenFDescribeCalled.ts');
        const failures = new Rule(ruleOptions).apply(sourceFile);
        expect(failures).length(1);
        expect(failures[0].getFailure()).eq('Calls to \'fdescribe\' are not allowed.');
    });

    it('should fail when "fit" is called', () => {
        const sourceFile = getSourceFile('shouldFailWhenFitCalled.ts');
        const failures = new Rule(ruleOptions).apply(sourceFile);
        expect(failures).length(1);
        expect(failures[0].getFailure()).eq('Calls to \'fit\' are not allowed.');
    });

    it('should not fail for a snippet without "fit" or "fdescribe"', () => {
        const sourceFile = getSourceFile('shouldPassWithoutFitOrFDescribe.ts');
        const failures = new Rule(ruleOptions).apply(sourceFile);
        expect(failures).length(0);
    });

    it('should not flag a false alert if "fdescribe" appears as a variable name', () => {
        const sourceFile = getSourceFile('allowsFDescribeAsVariableName.ts');
        const failures = new Rule(ruleOptions).apply(sourceFile);
        expect(failures).length(0);
    });

    it('should not flag a false alert if "fit" appears as a object property key or value', () => {
        const sourceFile = getSourceFile('allowsFitAsPropKeyValue.ts');
        const failures = new Rule(ruleOptions).apply(sourceFile);
        expect(failures).length(0);
    });

    it('should not flag a false alert if "fdescribe" or "fit" appear as function parameters', () => {
        const sourceFile = getSourceFile('allowsFdescribeFitAsFunctionParams.ts');
        const failures = new Rule(ruleOptions).apply(sourceFile);
        expect(failures).length(0);
    });
});

function getSourceFile(fileName: string): ts.SourceFile {
    const relativePath = path.join("src", "test", "specs", "snippets", fileName);
    const source = fs.readFileSync(relativePath, "utf8");
    return Lint.getSourceFile(fileName, source);
}
