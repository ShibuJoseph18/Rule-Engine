import ASTNode from '../services/ASTNode.js';
import Rule from '../models/Rule.js';
import storeAstInDb from '../services/storeAstInDb.js';

// Fetch ASTs for the given rule IDs from the database
async function fetchASTs(ruleIds) {
  const rules = await Rule.findAll({
    where: { id: ruleIds },
    attributes: ['id', 'name', 'ast_root']
  });
  return rules.map(rule => ({
    id: rule.id,
    name: rule.name,
    ast: JSON.parse(rule.ast_root) // Parse the stored AST string
  }));
}

// Count AND and OR operators in the AST for deciding root node priority
function countOperators(ast) {
  if (!ast) return { andCount: 0, orCount: 0 };
  
  const counts = { andCount: 0, orCount: 0 };
  
  if (ast.type === 'operator') {
    if (ast.value === 'AND') {
      counts.andCount++;
    } else if (ast.value === 'OR') {
      counts.orCount++;
    }
  }
  
  if (ast.left) {
    const leftCount = countOperators(ast.left);
    counts.andCount += leftCount.andCount;
    counts.orCount += leftCount.orCount;
  }
  
  if (ast.right) {
    const rightCount = countOperators(ast.right);
    counts.andCount += rightCount.andCount;
    counts.orCount += rightCount.orCount;
  }
  
  return counts;
}

// Extract unique conditions from the AST
function extractConditions(ast, conditionSet) {
  if (!ast) return;
  
  if (ast.type === 'operand') {
    conditionSet.add(ast.value); // Store unique condition
    return;
  }
  
  extractConditions(ast.left, conditionSet);
  extractConditions(ast.right, conditionSet);
}

// Build the combined AST from the extracted conditions and the chosen root operator
function buildCombinedAST(conditions, rootOperator) {
  const conditionNodes = Array.from(conditions).map(condition => 
    new ASTNode('operand', condition)
  );
  
  if (conditionNodes.length === 0) return null;
  
  let currentNode = conditionNodes[0];
  for (let i = 1; i < conditionNodes.length; i++) {
    currentNode = new ASTNode('operator', rootOperator, currentNode, conditionNodes[i]);
  }
  
  return currentNode;
}

// Main function to combine multiple ASTs
function combineASTs(asts) {
  const operatorCounts = asts.map(ast => countOperators(ast.ast));
  
  const totalAndCount = operatorCounts.reduce((sum, counts) => sum + counts.andCount, 0);
  const totalOrCount = operatorCounts.reduce((sum, counts) => sum + counts.orCount, 0);
  
  // Prioritize root operator based on frequency
  const rootOperator = totalAndCount >= totalOrCount ? 'AND' : 'OR';
  
  // Set to hold unique conditions
  const uniqueConditions = new Set();
  
  // Extract conditions from each AST
  asts.forEach(ast => extractConditions(ast.ast, uniqueConditions));
  
  // Build and return the combined AST
  return buildCombinedAST(uniqueConditions, rootOperator);
}

// Combine rules endpoint handler
export const combineRules = async (req, res) => {
  try {
    const { ruleIds, combinedRuleName } = req.body;

    // Validate input
    if (!Array.isArray(ruleIds) || !combinedRuleName?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Both rule IDs array and combined rule name are required'
      });
    }
    if (ruleIds.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'At least two rules are required for combination'
      });
    }

    // Fetch ASTs from the database
    const asts = await fetchASTs(ruleIds);
    if (asts.length !== ruleIds.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more rules not found in the database'
      });
    }

    // Generate unique identifier for the combined rule
    const combinedRuleId = ruleIds.sort().join('-');

    // Check if the combination already exists
    // const existingRule = await Rule.findOne({
    //   where: { rule_string: combinedRuleId }
    // });
    // if (existingRule) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'This combination of rules already exists'
    //   });
    // }

    // Combine the ASTs
    const combinedAST = combineASTs(asts);
    if (!combinedAST) {
      return res.status(400).json({
        success: false,
        message: 'Failed to combine rules'
      });
    }

    // Create new rule name with combined rule identifier
    const newRuleName = `${combinedRuleName.trim()} (${combinedRuleId})`;

    // Store the combined AST in the database
    const stored = await storeAstInDb(
      newRuleName,
      combinedRuleId,
      JSON.stringify(combinedAST) // Stringify the AST before storing
    );
    if (!stored) {
      throw new Error('Failed to store combined rule');
    }

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Rules combined successfully',
      combinedRule: {
        name: newRuleName,
        id: combinedRuleId,
        ast: combinedAST
      }
    });
    
  } catch (error) {
    console.error('Error combining rules:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while combining rules',
      error: error.message
    });
  }
};
