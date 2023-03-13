import CalculatorLexer from "./lexer";
import parser from "./parser";
import interpreter from "./visitor";

export default function (text: string) {
  // 1. Tokenize the input.
  const lexResult = CalculatorLexer.tokenize(text);

  // 2. Parse the Tokens vector.
  parser.input = lexResult.tokens;
  const cst = parser.expression();

  // 3. Perform semantics using a CstVisitor.
  // Note that separation of concerns between the syntactic analysis (parsing) and the semantics.
  const value = interpreter.visit(cst);

  return {
    value: value,
    lexResult: lexResult,
    parseErrors: parser.errors,
  };
}
