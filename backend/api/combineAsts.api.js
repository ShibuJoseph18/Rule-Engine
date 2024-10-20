import ASTNode from '../services/ASTNode.js';
import Rule from '../models/Rule.js';
import storeAstInDb from '../services/storeAstInDb.js';

async function fetchASTs(ruleIds) {
  const rules = await Rule.findAll({
    where: {
      id: ruleIds
    },
    attributes: ['id', 'name', 'ast_root']
  });
  return rules.map(rule => ({
    id: rule.id,
    name: rule.name,
    ast: JSON.parse(rule.ast_root) // Parse the stored AST string
  }));
}

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

function combineASTs(asts) {
  const operatorCounts = asts.map(ast => countOperators(ast.ast));
  
  const totalAndCount = operatorCounts.reduce((sum, counts) => sum + counts.andCount, 0);
  const totalOrCount = operatorCounts.reduce((sum, counts) => sum + counts.orCount, 0);
  
  const rootOperator = totalAndCount >= totalOrCount ? 'AND' : 'OR';

  // Create a set to hold unique conditions
  const uniqueConditions = new Set();

  // Function to extract conditions from an AST
  function extractConditions(ast) {
    if (!ast) return;

    if (ast.type === 'operand') {
      uniqueConditions.add(ast.value);
      return;
    }

    extractConditions(ast.left);
    extractConditions(ast.right);
  }

  // Extract conditions from each AST
  asts.forEach(ast => extractConditions(ast.ast));

  // Build the new combined AST
  function buildCombinedAST() {
    const conditionNodes = Array.from(uniqueConditions).map(condition => 
      new ASTNode('operand', condition)
    );

    let currentNode = conditionNodes[0];

    for (let i = 1; i < conditionNodes.length; i++) {
      currentNode = new ASTNode('operator', rootOperator, currentNode, conditionNodes[i]);
    }

    return currentNode;
  }

  return buildCombinedAST();
}

export const combineRules = async (req, res) => {
  try {
    const { ruleIds, combinedRuleName } = req.body;

    // Input validation
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

    // Fetch ASTs
    const asts = await fetchASTs(ruleIds);
    
    if (asts.length !== ruleIds.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more rules not found in database'
      });
    }

    // Generate combined rule identifier
    const combinedRuleId = ruleIds.sort().join('-');
    
    // Check for existing combination
    const existingRule = await Rule.findOne({
      where: { rule_string: combinedRuleId }
    });

    if (existingRule) {
      return res.status(400).json({
        success: false,
        message: 'This combination of rules already exists'
      });
    }

    // Combine the ASTs
    const combinedAST = combineASTs(asts);
    
    // Create new rule name
    const newRuleName = `${combinedRuleName.trim()} (${combinedRuleId})`;

    // Store in database
    const stored = await storeAstInDb(
      newRuleName,
      combinedRuleId,
      JSON.stringify(combinedAST) // Ensure AST is stringified for storage
    );

    if (!stored) {
      throw new Error('Failed to store combined rule');
    }

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
}