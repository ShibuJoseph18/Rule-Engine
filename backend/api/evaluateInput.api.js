import Rule from '../models/Rule.js';
import { evaluateAST } from '../services/evaluator.js'; 

export const evaluateInput = async (req, res, next) => {
  try {
    const { ruleId, userInput } = req.body; // Get the rule ID and user input from the request body

    // Fetch the rule from the database by ID
    const rule = await Rule.findByPk(ruleId);
    
    // Check if the rule exists
    if (!rule) {
      return res.status(404).json({ message: 'Rule not found' });
    }

    // Parse the stored AST root
    const astRoot = JSON.parse(rule.ast_root);

    // Evaluate the user input against the AST
    const result = evaluateAST(astRoot, userInput); 

    // Api response
    return res.status(200).json({
      message: 'Evaluation successful',
      result,
      evaluation: result 
        ? "The user input meets all conditions of the rule." 
        : "The user input does not meet all conditions of the rule."
    });
  } catch (error) {
    console.error('Error evaluating rule:', error);
    return res.status(500).json({ message: 'Error evaluating rule', error: error.message });
  }
};