import CalculatorLexer from "./lexer";
import parser from "./parser";
import interpreter from "./visitor";

export default function (text: string) {
  if (typeof text !== "string") return;
  const inputText = text;
  // 1. Tokenize the input.
  const lexResult = CalculatorLexer.tokenize(inputText);

  // 2. Parse the Tokens vector.
  parser.input = lexResult.tokens;

  const cst = parser.code();

  // 3. Perform semantics using a CstVisitor.
  // Note that separation of concerns between the syntactic analysis (parsing) and the semantics.
  const value = interpreter.visit(cst);

  return value;
}
