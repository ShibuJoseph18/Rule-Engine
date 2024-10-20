export function evaluateAST(node, data) {
  if (!node) return false; 

  // If the node is an operand, evaluate the condition
  if (node.type === 'operand') {
    const condition = node.value.split(' ');
    const left = condition[0];
    const operator = condition[1];
    const right = condition[2].replace(/'/g, ""); // Remove single quotes

    // Ensure that data[left] exists before comparing
    if (!(left in data)) {
      throw new Error(`Invalid field: ${left}`);
    }

    switch (operator) {
      case '>':
        return data[left] > Number(right);
      case '<':
        return data[left] < Number(right);
      case '=':
        return data[left] === right;
      case '>=':
        return data[left] >= Number(right);
      case '<=':
        return data[left] <= Number(right);
      case '!=':
        return data[left] !== right;
      default:
        throw new Error(`Invalid operator: ${operator}`);
    }
  }

  // If the node is an operator, evaluate based on operator type
  if (node.type === 'operator') {
    const leftResult = evaluateAST(node.left, data);
    const rightResult = evaluateAST(node.right, data);

    switch (node.value) {
      case 'AND':
        return leftResult && rightResult;
      case 'OR':
        return leftResult || rightResult;
      default:
        throw new Error(`Invalid operator: ${node.value}`);
    }
  }

  return false; // Default fallback
}