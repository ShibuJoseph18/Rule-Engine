export default class ASTNode {
    constructor(type, value = null, left = null, right = null) {
      this.type = type; // "operator" for AND/OR, "operand" for conditions
      this.value = value; // Optional value for operand nodes
      this.left = left; // Left child
      this.right = right; // Right child
    }
  }
  