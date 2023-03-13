import { createToken, tokenMatcher, Lexer, CstParser } from "chevrotain";

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

export const PowerFunc = createToken({ name: "PowerFunc", pattern: /power/ });
export const Comma = createToken({ name: "Comma", pattern: /,/ });

// marking WhiteSpace as 'SKIPPED' makes the lexer skip it.
export const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /\s+/,
  group: Lexer.SKIPPED,
});

export const allTokens = [
  WhiteSpace, // whitespace is normally very common so it should be placed first to speed up the lexer's performance
  Plus,
  Minus,
  Multi,
  Div,
  LParen,
  RParen,
  NumberLiteral,
  AdditionOperator,
  MultiplicationOperator,
  PowerFunc,
  Comma,
];
const CalculatorLexer = new Lexer(allTokens);

export default CalculatorLexer;