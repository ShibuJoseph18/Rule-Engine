import Rule from "../models/Rule.js";

export default async function storeAstInDb(name, ruleString, astRoot){
    try {
        const newRule = await Rule.create({
          name,
          rule_string: ruleString,
          ast_root: JSON.stringify(astRoot),  // Store AST root as a string
        });
    
        return true;

      } catch (error) {
        throw new Error(`Database insertion failed: ${error.message}`);  
      }
    
}