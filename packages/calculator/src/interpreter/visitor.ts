import { tokenMatcher } from "chevrotain";
import { convertCurrency } from "./currencies";
import standardFunctions from "./functions";
import { Plus, Multi } from "./lexer";
import parser from "./parser";

const BaseCstVisitor = parser.getBaseCstVisitorConstructor();

// All our semantics go into the visitor, completly separated from the grammar.
class CalculatorInterpreter extends BaseCstVisitor {
  constructor() {
    super();
    // This helper will detect any missing or redundant methods on this visitor
    this.validateVisitor();
  }

  code(ctx) {
    if (Array.isArray(ctx.statement)) {
      return ctx.statement.map((l) => this.visit(l)).join("\n");
    }
    return "";
  }

  statement(ctx) {
    return this.visit(ctx.expression);
  }

  expression(ctx) {
    return this.visit(ctx.conversionExpression);
  }

  conversionExpression(ctx) {
    const mathRes = this.visit(ctx.mathExpression);
    if (ctx.Currency) {
      const c1 = ctx.Currency[0].image;
      const c2 = ctx.Currency[1].image;
      return convertCurrency(mathRes, c1, c2);
    }
    return mathRes;
  }

  // Note the usage if the "rhs" and "lhs" labels to increase the readability.
  additionExpression(ctx) {
    let result = this.visit(ctx.lhs);

    // "rhs" key may be undefined as the grammar defines it as optional (MANY === zero or more).
    if (ctx.rhs) {
      ctx.rhs.forEach((rhsOperand, idx) => {
        // there will be one operator for each rhs operand
        const rhsValue = this.visit(rhsOperand);
        const operator = ctx.AdditionOperator[idx];

        if (tokenMatcher(operator, Plus)) {
          result += rhsValue;
        } else {
          // Minus
          result -= rhsValue;
        }
      });
    }

    return result;
  }

  mathExpression(ctx) {
    let result = this.visit(ctx.lhs);
    if (ctx.rhs) {
      ctx.rhs.forEach((rhsOperand, idx) => {
        const rhsValue = this.visit(rhsOperand);
        const funcName = ctx.Func?.[idx];
        if (funcName != null) {
          const func = standardFunctions[funcName.image];
          if (func == null) return;
          if (func) {
            result = func([result, rhsValue]);
          }
        }
      });
    }

    return result;
  }

  multiplicationExpression(ctx) {
    let result = this.visit(ctx.lhs);

    // "rhs" key may be undefined as the grammar defines it as optional (MANY === zero or more).
    if (ctx.rhs) {
      ctx.rhs.forEach((rhsOperand, idx) => {
        // there will be one operator for each rhs operand
        const rhsValue = this.visit(rhsOperand);
        const operator = ctx.MultiplicationOperator[idx];

        if (tokenMatcher(operator, Multi)) {
          result *= rhsValue;
        } else {
          // Division
          result /= rhsValue;
        }
      });
    }

    return result;
  }

  atomicExpression(ctx) {
    if (ctx.parenthesisExpression) {
      return this.visit(ctx.parenthesisExpression);
    } else if (ctx.NumberLiteral) {
      if (ctx.NumberLiteral[0].image.includes(".")) {
        return parseFloat(ctx.NumberLiteral[0].image);
      }
      return parseInt(ctx.NumberLiteral[0].image, 10);
    } else if (ctx.func) {
      return this.visit(ctx.func);
    }
  }

  parenthesisExpression(ctx) {
    // The ctx will also contain the parenthesis tokens, but we don't care about those
    // in the context of calculating the result.
    return this.visit(ctx.expression);
  }

  func(ctx) {
    const func = standardFunctions[ctx.Func[0].image];
    if (func == null) return;
    const args = this.visit(ctx.args[0]);
    return func(args);
  }

  args(ctx) {
    return ctx.expression.map((e) => this.visit(e));
  }
}

// We only need a single interpreter instance because our interpreter has no state.
const interpreter = new CalculatorInterpreter();

export default interpreter;
