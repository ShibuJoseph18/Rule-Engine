export class ASTNode {
    constructor(type, value = null, left = null, right = null) {
      this.type = type; // "operator" for AND/OR, "operand" for conditions
      this.value = value; // Optional value for operand nodes
      this.left = left; // Left child
      this.right = right; // Right child
    }
  }
  
  function tokenize(ruleString) {
    const regex = /(\bAND\b|\bOR\b|>=|<=|!=|>|<|=|\(|\)|\w+\s*!=\s*\w+|\w+\s*=\s*\w+|\w+\s*>\s*\d+|\w+\s*<\s*\d+|\w+\s*>=\s*\d+|\w+\s*<=\s*\d+|\w+)/g;
    const tokens = ruleString.match(regex);
  
    if (!tokens) {
      throw new Error("Invalid rule format: Unable to parse tokens.");
    }
  
    return tokens;
  }
  
  export function parseRuleToAST(ruleString) {
    const tokens = tokenize(ruleString);
    const parsedAST = createAST(tokens);
    return parsedAST;
  }
  
  function createAST(tokens) {
    const output = [];
    const operators = [];
    const precedence = { 'AND': 1, 'OR': 0 }; // Operator precedence
  
    const applyOperator = () => {
      const operator = operators.pop();
      const rightNode = output.pop();
      const leftNode = output.pop();
      output.push(new ASTNode("operator", operator, leftNode, rightNode));
    };
  
    for (const token of tokens) {
      if (/\w+/.test(token)) { // If the token is an operand (e.g., age, department)
        output.push(new ASTNode("operand", token));
      } else if (token === '(') {
        operators.push(token);
      } else if (token === ')') {
        while (operators.length && operators[operators.length - 1] !== '(') {
          applyOperator();
        }
        operators.pop(); // Remove the '(' from the stack
      } else if (precedence[token] !== undefined) { // If the token is an operator
        while (operators.length && precedence[operators[operators.length - 1]] >= precedence[token]) {
          applyOperator();
        }
        operators.push(token);
      }
    }
  
    while (operators.length) {
      applyOperator();
    }
  
    return output[0]; // The root of the AST
  }
  