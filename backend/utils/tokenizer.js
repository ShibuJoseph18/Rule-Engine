export function tokenize(ruleString) {
    const regex = /(\bAND\b|\bOR\b|>=|<=|!=|>|<|=|\(|\)|\w+\s*!=\s*\w+|\w+\s*=\s*\w+|\w+\s*>\s*\d+|\w+\s*<\s*\d+|\w+\s*>=\s*\d+|\w+\s*<=\s*\d+|\w+)/g;
    const tokens = ruleString.match(regex);
  
    if (!tokens) {
      throw new Error("Invalid rule format: Unable to parse tokens.");
    }
  
    return tokens;
  }
  
  