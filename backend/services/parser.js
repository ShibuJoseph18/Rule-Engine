import { buildAST } from './ASTBuilder.js';
import { tokenize } from './tokenizer.js';  
// import { evaluateAST } from './evaluator.js';

export default function transformToAST(ruleString) {
  const tokens = tokenize(ruleString);
  const parsedAST = buildAST(tokens);
  return parsedAST;
}
