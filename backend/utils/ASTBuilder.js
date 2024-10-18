import { ASTNode } from './ASTNode.js';
export function createAST(tokens) {
    const output = [];
    const operators = [];
    const precedence = { 'AND': 1, 'OR': 0 };
  
    const applyOperator = () => {
      const operator = operators.pop();
      const rightNode = output.pop();
      const leftNode = output.pop();
      output.push(new ASTNode("operator", operator, leftNode, rightNode));
    };
  
    for (const token of tokens) {
      if (/\w+/.test(token)) {
        output.push(new ASTNode("operand", token));
      } else if (token === '(') {
        operators.push(token);
      } else if (token === ')') {
        while (operators.length && operators[operators.length - 1] !== '(') {
          applyOperator();
        }
        operators.pop(); 
      } else if (precedence[token] !== undefined) {
        while (operators.length && precedence[operators[operators.length - 1]] >= precedence[token]) {
          applyOperator();
        }
        operators.push(token);
      }
    }
  
    while (operators.length) {
      applyOperator();
    }
  
    return output[0]; 
  }