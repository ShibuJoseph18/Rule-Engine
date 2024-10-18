import { buildAST } from './ASTBuilder.js';
import { tokenize } from './tokenizer.js';  

export function parseRuleToAST(ruleString) {
  const tokens = tokenize(ruleString);
  const parsedAST = buildAST(tokens);
  return parsedAST;
}

