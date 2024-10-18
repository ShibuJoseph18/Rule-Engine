import { ASTNode } from './ASTNode.js';

export function buildAST(tokens) {
    const output = [];
    const operators = [];
    const precedence = { 'AND': 1, 'OR': 0 };

    const applyOperator = () => {
        const operator = operators.pop();
        const rightNode = output.pop();
        const leftNode = output.pop();
        output.push(new ASTNode("operator", operator, leftNode, rightNode));
    };

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];

        if (token === '(') {
            operators.push(token);
        } else if (token === ')') {
            while (operators.length && operators[operators.length - 1] !== '(') {
                applyOperator();
            }
            operators.pop(); // Remove the '('
        } else if (precedence[token] !== undefined) {
            while (operators.length && precedence[operators[operators.length - 1]] >= precedence[token]) {
                applyOperator();
            }
            operators.push(token);
        } else {
            // Handle operands (composite conditions like "age > 30")
            let value = token;

            // Check for next tokens to build a complete condition
            if (i + 2 < tokens.length && /[><=!]+/.test(tokens[i + 1])) {
                value = `${token} ${tokens[i + 1]} ${tokens[i + 2]}`; // Form like "age > 30"
                i += 2; // Move index to skip the next two tokens
            }

            output.push(new ASTNode("operand", value));
        }
    }

    // Apply any remaining operators in the stack
    while (operators.length) {
        applyOperator();
    }

    // Return the root node of the AST
    return output[0]; 
}