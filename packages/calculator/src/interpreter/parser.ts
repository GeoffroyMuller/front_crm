import { CstParser } from "chevrotain";
import {
  allTokens,
  AdditionOperator,
  MultiplicationOperator,
  NumberLiteral,
  LParen,
  RParen,
  PowerFunc,
  Comma,
} from "./lexer";

// Not any actions (semantics) to perform during parsing.
class CalculatorPure extends CstParser {
  // Unfortunately no support for class fields with initializer in ES2015, only in esNext...
  // so the parsing rules are defined inside the constructor, as each parsing rule must be initialized by
  // invoking RULE(...)
  // see: https://github.com/jeffmo/es-class-fields-and-static-properties
  constructor() {
    super(allTokens);

    this.RULE("expression", () => {
      this.SUBRULE(this.additionExpression);
    });

    // Lowest precedence thus it is first in the rule chain
    // The precedence of binary expressions is determined by how far down the Parse Tree
    // The binary expression appears.
    this.RULE("additionExpression", () => {
      // using labels can make the CST processing easier
      this.SUBRULE(this.multiplicationExpression, { LABEL: "lhs" });
      this.MANY(() => {
        // consuming 'AdditionOperator' will consume either Plus or Minus as they are subclasses of AdditionOperator
        this.CONSUME(AdditionOperator);
        //  the index "2" in SUBRULE2 is needed to identify the unique position in the grammar during runtime
        this.SUBRULE2(this.multiplicationExpression, { LABEL: "rhs" });
      });
    });

    this.RULE("multiplicationExpression", () => {
      this.SUBRULE(this.atomicExpression, { LABEL: "lhs" });
      this.MANY(() => {
        this.CONSUME(MultiplicationOperator);
        //  the index "2" in SUBRULE2 is needed to identify the unique position in the grammar during runtime
        this.SUBRULE2(this.atomicExpression, { LABEL: "rhs" });
      });
    });

    this.RULE("atomicExpression", () => {
      this.OR([
        // parenthesisExpression has the highest precedence and thus it appears
        // in the "lowest" leaf in the expression ParseTree.
        { ALT: () => this.SUBRULE(this.parenthesisExpression) },
        { ALT: () => this.CONSUME(NumberLiteral) },
        { ALT: () => this.SUBRULE(this.powerFunction) },
      ]);
    });

    this.RULE("parenthesisExpression", () => {
      this.CONSUME(LParen);
      this.SUBRULE(this.expression);
      this.CONSUME(RParen);
    });

    this.RULE("powerFunction", () => {
      this.CONSUME(PowerFunc);
      this.CONSUME(LParen);
      this.SUBRULE(this.expression, { LABEL: "base" });
      this.CONSUME(Comma);
      this.SUBRULE2(this.expression, { LABEL: "exponent" });
      this.CONSUME(RParen);
    });

    // very important to call this after all the rules have been defined.
    // otherwise the parser may not work correctly as it will lack information
    // derived during the self analysis phase.
    this.performSelfAnalysis();
  }
}

// wrapping it all together
// reuse the same parser instance.
const parser = new CalculatorPure([]);

export default parser;
