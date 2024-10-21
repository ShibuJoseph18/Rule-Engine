import { buildAST } from './ASTBuilder.js';
import { tokenize } from './tokenizer.js';  

export default function transformToAST(ruleString) {
  const tokens = tokenize(ruleString);
  const parsedAST = buildAST(tokens);
  return parsedAST;
}
