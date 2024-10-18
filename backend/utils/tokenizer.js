export function tokenize(ruleString) {
    // Regular expression to match various components of the expression
    const regex = /\s*(\(|\)|\bAND\b|\bOR\b|>=|<=|!=|>|<|=|'\w+'|\w+|\d+)\s*/g;
    
    // Match tokens using the regex
    const tokens = ruleString.match(regex).filter(token => token.trim() !== '');

    if (!tokens) {
        throw new Error("Invalid rule format: Unable to parse tokens.");
    }

    // Clean tokens to remove unwanted characters such as newlines
    return tokens.map(token => token.replace(/\s+/g, '')).filter(token => token.length > 0);

}