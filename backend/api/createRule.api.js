import transformToAST from '../services/parser.js';
import Rule from '../models/Rule.js';
import storeAstInDb from '../services/storeAstInDb.js';

// Controller to handle adding a rule
export const createRule = async (req, res, next) => {
  try {
    const { name, ruleString } = req.body;
 
    // Check if both name and rule are provided
    if (!name.trim() || !ruleString.trim()) {
      return res.status(400).json({ message: 'Both name and rule are required' });
    }
 
    // Check if the rule string already exists
    const existingRule = await Rule.findOne({ where: { rule_string: ruleString } });
    if (existingRule) {
      return res.status(400).json({ message: 'Rule string already exists. Please use a unique rule.' });
    }

    // Send the rule string to the AST transformation service
    const astRoot = transformToAST(ruleString);

    // Check if the transformation was successful
    if (!astRoot) {
      return res.status(500).json({ message: 'AST transformation failed' });
    }

    // Save rule in the database
    await storeAstInDb(name, ruleString, astRoot);
    return res.status(201).json({ message: 'Rule created and stored successfully', astRoot});

  } catch (error) {
    next(error);  // Pass errors to middleware
  }
};