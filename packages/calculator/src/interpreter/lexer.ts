import {
  createToken as chevrotainCreateToken,
  Lexer,
  type ITokenConfig,
  type TokenType,
} from "chevrotain";

export const allTokens: TokenType[] = [];
function createToken(params: ITokenConfig): TokenType {
  const token = chevrotainCreateToken(params);
  allTokens.push(token);
  return token;
}

export const EndLine = createToken({
  name: "EndLine",
  pattern: /\n/,
});

export const AdditionOperator = createToken({
  name: "AdditionOperator",
  pattern: Lexer.NA,
});
export const Plus = createToken({
  name: "Plus",
  pattern: /\+/,
  categories: AdditionOperator,
});
export const Minus = createToken({
  name: "Minus",
  pattern: /-/,
  categories: AdditionOperator,
});

export const MultiplicationOperator = createToken({
  name: "MultiplicationOperator",
  pattern: Lexer.NA,
});
export const Multi = createToken({
  name: "Multi",
  pattern: /\*/,
  categories: MultiplicationOperator,
});
export const Div = createToken({
  name: "Div",
  pattern: /\//,
  categories: MultiplicationOperator,
});

export const LParen = createToken({ name: "LParen", pattern: /\(/ });
export const RParen = createToken({ name: "RParen", pattern: /\)/ });
export const NumberLiteral = createToken({
  name: "NumberLiteral",
  pattern: /[1-9]\d*/,
});

export const Func = createToken({
  name: "Func",
  pattern: /[a-zA-Z]+/,
});
export const Comma = createToken({ name: "Comma", pattern: /,/ });

// marking WhiteSpace as 'SKIPPED' makes the lexer skip it.
export const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /\s+/,
  group: Lexer.SKIPPED,
});

const CalculatorLexer = new Lexer(allTokens);

export default CalculatorLexer;
