import * as Lint from "tslint";
import * as ts from "typescript";

export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: Lint.IRuleMetadata = {
        /* tslint:disable:object-literal-sort-keys */
        ruleName: "defocus",
        description: "Bans the use of `fdescribe` and 'fit' Jasmine functions.",
        rationale: "It is all too easy to mistakenly commit a focussed Jasmine test suite or spec.",
        options: null,
        optionsDescription: "Not configurable.",
        type: "functionality",
        typescriptOnly: false,
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        if (node.kind === ts.SyntaxKind.CallExpression) {
            const expression = (node as ts.CallExpression).expression;
            const functionName = expression.getText();
            bannedFunctions.forEach((banned) => {
                if (banned === functionName) {
                    ctx.addFailureAtNode(expression, failureMessage(functionName));
                }
            });
        }
        return ts.forEachChild(node, cb);
    });
}

const bannedFunctions: ReadonlyArray<string> = ["fdescribe", "fit"];

const failureMessage = (functionName: string) => {
    return `Calls to '${functionName}' are not allowed.`;
};
