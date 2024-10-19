import transformToAST from '../services/parser.js';
import Rule from '../models/Rule.js';

// Controller to handle adding a rule
export const createRule = async (req, res, next) => {
  try {
    // console.log('input data: ', req.body);
    const { name, ruleString } = req.body;
//     console.log(typeof(name), typeof(ruleString));
//     // console.log('ruleString: ', name, typeof(ruleString), ruleString);
    console.log('ruleString: ', ruleString);  
    // ruleString = ruleString.trim().toLowerCase();

    // Check if the rule string already exists
    const existingRule = await Rule.findOne({ where: { rule_string: ruleString } });

    if (existingRule) {
        return res.status(400).json({ message: 'Rule string already exists. Please use a unique rule.' });
    }

// // 
    // Send the rule string to the AST transformation service
    const astRoot = transformToAST(ruleString);
    // console.log('astRoot: ', astRoot);
    if (!astRoot) {
      return res.status(500).json({ message: 'AST transformation failed' });
    }
    // console.log('astRoot: ', astRoot);
    // console.log('astRoot: ', JSON.stringify(astRoot));

    // Save rule in the database
    try {
      const newRule = await Rule.create({
        name,
        rule_string: ruleString,
        ast_root: JSON.stringify(astRoot),  // Store AST root as a string
      });
  
      return res.status(201).json({
        message: 'Rule added successfully',
        rule: newRule,
      });
    } catch (error) {
      next(error);
      console.log('dbinsert',error)
    }
    
  } catch (error) {
    console.error('theerror: ', error);
    next(error);  // Pass errors to middleware
  }
};