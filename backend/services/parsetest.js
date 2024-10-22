// class ASTNode {
//     constructor(type, value, left = null, right = null) {
//         this.type = type; // "operator" or "operand"
//         this.value = value; // the value of the node
//         this.left = left; // left child
//         this.right = right; // right child
//     }
// }

// function createAST(tokens) {
//     const output = [];
//     const operators = [];
//     const precedence = { 'AND': 1, 'OR': 0 };

//     const applyOperator = () => {
//         const operator = operators.pop();
//         const rightNode = output.pop();
//         const leftNode = output.pop();
//         output.push(new ASTNode("operator", operator, leftNode, rightNode));
//     };

//     for (let i = 0; i < tokens.length; i++) {
//         const token = tokens[i];

//         if (token === '(') {
//             operators.push(token);
//         } else if (token === ')') {
//             while (operators.length && operators[operators.length - 1] !== '(') {
//                 applyOperator();
//             }
//             operators.pop(); // Remove the '('
//         } else if (precedence[token] !== undefined) {
//             while (operators.length && precedence[operators[operators.length - 1]] >= precedence[token]) {
//                 applyOperator();
//             }
//             operators.push(token);
//         } else {
//             // Handle operands (composite conditions like "age > 30")
//             let value = token;

//             // Check for next tokens to build a complete condition
//             if (i + 2 < tokens.length && /[><=!]+/.test(tokens[i + 1])) {
//                 value = `${token} ${tokens[i + 1]} ${tokens[i + 2]}`; // Form like "age > 30"
//                 i += 2; // Move index to skip the next two tokens
//             }

//             output.push(new ASTNode("operand", value));
//         }
//     }

//     // Apply any remaining operators in the stack
//     while (operators.length) {
//         applyOperator();
//     }

//     // Return the root node of the AST
//     return output[0]; 
// }

// function evaluateAST(node, data) {
//     if (!node) return false;

//     // If the node is an operand, evaluate the condition
//     if (node.type === 'operand') {
//         const condition = node.value.split(' ');
//         const left = condition[0];
//         const operator = condition[1];
//         const right = condition[2].replace(/'/g, ""); // Remove single quotes

//         switch (operator) {
//             case '>':
//                 return data[left] > Number(right);
//             case '<':
//                 return data[left] < Number(right);
//             case '=':
//                 return data[left] === right;
//             case '>=':
//                 return data[left] >= Number(right);
//             case '<=':
//                 return data[left] <= Number(right);
//             case '!=':
//                 return data[left] !== right;
//             default:
//                 return false;
//         }
//     }

//     // If the node is an operator, evaluate based on operator type
//     if (node.type === 'operator') {
//         const leftResult = evaluateAST(node.left, data);
//         const rightResult = evaluateAST(node.right, data);

//         switch (node.value) {
//             case 'AND':
//                 return leftResult && rightResult;
//             case 'OR':
//                 return leftResult || rightResult;
//             default:
//                 return false;
//         }
//     }
// }


// // Usage Example
// const tokens = [
//   '(',           '(',          'age',
//   '>',           '30',         'AND',
//   'department',  '=',          "'Sales'",
//   ')',           'OR',         '(',
//   'age',         '<',          '25',
//   'AND',         'department', '=',
//   "'Marketing'", ')',          ')', 
//   'AND',         '(',          'salary',
//   '>',           '50000',      'OR',
//   'experience',  '>',          '5',
//   ')'
// ];

// const ast = createAST(tokens);
// // console.log(ast);
// console.log(JSON.stringify(ast, null, 2));
// console.log(evaluateAST(ast, { age: 24, department: 'Marketing', salary: 70000, experience: 7 }));


// // parseRuleToAST(`((age > 30 AND department = 'Sales') OR (age < 25 AND
// // department = 'Marketing')) AND (salary > 50000 OR experience >
// // 5)`);

import Rule from '../models/Rule.js'; // Import your Rule model
import sequelize from '../config/database.js'; // Import your sequelize instance

async function resetTable() {
  try {
    // Step 1: Delete all rows in the table
    await Rule.destroy({
      where: {},
      truncate: true // This will remove all rows and reset the auto-increment counter
    });

    console.log('Table reset');
  } catch (error) {
    console.error('Error resetting table:', error);
  }
}

// resetTable();


async function resetAutoIncrement() {
    try {
      // Step 1: Find the maximum ID in the Rule table
      const result = await Rule.max('id');
      const maxId = result || 0; // If no rows are found, set maxId to 0
  
      // Step 2: Restart the auto-increment sequence based on the max ID
      await sequelize.query(`ALTER SEQUENCE "Rules_id_seq" RESTART WITH ${maxId + 1}`);
  
      console.log(`Auto-increment counter restarted at ${maxId + 1}`);
    } catch (error) {
      console.error('Error resetting auto-increment counter:', error);
    }
  }
  
  resetAutoIncrement();
