import { CstParser } from "chevrotain";
import {
  allTokens,
  AdditionOperator,
  MultiplicationOperator,
  NumberLiteral,
  LParen,
  RParen,
  Func,
  Comma,
  EndLine,
  Currency,
} from "./lexer";

// Not any actions (semantics) to perform during parsing.
class CalculatorPure extends CstParser {
  // Unfortunately no support for class fields with initializer in ES2015, only in esNext...
  // so the parsing rules are defined inside the constructor, as each parsing rule must be initialized by
  // invoking RULE(...)
  // see: https://github.com/jeffmo/es-class-fields-and-static-properties
  constructor() {
    super(allTokens);

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const $ = this;

    $.RULE("code", () => {
      $.MANY(() => {
        $.SUBRULE($.statement);
      });
    });

    $.RULE("statement", () => {
      $.CONSUME(EndLine);
      $.SUBRULE($.expression);
    });

    $.RULE("expression", () => {
      $.SUBRULE($.conversionExpression);
    });

    $.RULE("conversionExpression", () => {
      $.SUBRULE($.additionExpression, { LABEL: "lhs" });
      $.MANY(() => {
        $.CONSUME(Func);
        //  the index "2" in SUBRULE2 is needed to identify the unique position in the grammar during runtime
        $.SUBRULE2($.additionExpression, { LABEL: "rhs" });
      });
    });


    // Lowest precedence thus it is first in the rule chain
    // The precedence of binary expressions is determined by how far down the Parse Tree
    // The binary expression appears.
    $.RULE("additionExpression", () => {
      // using labels can make the CST processing easier
      $.SUBRULE($.multiplicationExpression, { LABEL: "lhs" });
      $.MANY(() => {
        // consuming 'AdditionOperator' will consume either Plus or Minus as they are subclasses of AdditionOperator
        $.CONSUME(AdditionOperator);
        //  the index "2" in SUBRULE2 is needed to identify the unique position in the grammar during runtime
        $.SUBRULE2($.multiplicationExpression, { LABEL: "rhs" });
      });
    });

    $.RULE("multiplicationExpression", () => {
      $.SUBRULE($.atomicExpression, { LABEL: "lhs" });
      $.MANY(() => {
        $.CONSUME(MultiplicationOperator);
        //  the index "2" in SUBRULE2 is needed to identify the unique position in the grammar during runtime
        $.SUBRULE2($.atomicExpression, { LABEL: "rhs" });
      });
    });

    $.RULE("atomicExpression", () => {
      $.OR([
        // parenthesisExpression has the highest precedence and thus it appears
        // in the "lowest" leaf in the expression ParseTree.
        { ALT: () => $.SUBRULE($.parenthesisExpression) },
        { ALT: () => $.CONSUME(NumberLiteral) },
        { ALT: () => $.SUBRULE($.func) },
      ]);
    });

    $.RULE("parenthesisExpression", () => {
      $.CONSUME(LParen);
      $.SUBRULE($.expression);
      $.CONSUME(RParen);
    });

    $.RULE("func", () => {
      $.CONSUME(Func);
      $.CONSUME(LParen);
      $.SUBRULE($.args);
      $.CONSUME(RParen);
    });

    $.RULE("args", () => {
      $.MANY_SEP({
        SEP: Comma,
        DEF: () => {
          $.SUBRULE($.expression);
        },
      });
    });

    // very important to call $ after all the rules have been defined.
    // otherwise the parser may not work correctly as it will lack information
    // derived during the self analysis phase.
    $.performSelfAnalysis();
  }
}

// wrapping it all together
// reuse the same parser instance.
const parser = new CalculatorPure([]);

export default parser;
