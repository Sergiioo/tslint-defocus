import * as ts from "typescript";
import * as Lint from "tslint/lib/lint";

export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: Lint.IRuleMetadata = {
        ruleName: "defocus",
        description: "Bans the use of `fdescribe` and 'fit' Jasmine functions.",
        rationale: "It is all too easy to mistakenly commit a focussed Jasmine test suite or spec.",
        options: {},
        type: "functionality",
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        var banFunctionWalker = new DefocusFunctionWalker(sourceFile, this.getOptions());
        return this.applyWithWalker(banFunctionWalker);
    }
}

export class DefocusFunctionWalker extends Lint.RuleWalker {

    private bannedFunctions: string[] = ["fdescribe", "fit"];

    public visitCallExpression(node: ts.CallExpression) {
        const expression = node.expression;
        const functionName = expression.getText();

        this.bannedFunctions.forEach(banned => {
            if (banned === functionName) {
                const failure = this.createFailure(
                    expression.getStart(),
                    expression.getWidth(),
                    `Calls to '${functionName}' are not allowed.`
                );
                this.addFailure(failure);
            }
        });

        super.visitCallExpression(node);
    }
}
