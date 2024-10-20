import transformToAST from '../services/parser.js';
import Rule from '../models/Rule.js';
// import storeAstInDb from '../services/storeAstInDb.js';

export const modifyRule = async (req, res, next) => {
    const { id } = req.params; // Get the rule ID from the URL parameters
    const { name, ruleString } = req.body; // Get the updated name and rule string from the request body

    try {

        // Check for null or empty rule string
        if (!ruleString.trim()) {
            return res.status(400).json({ message: 'Rule string cannot be null or empty.' });
        } 

        // Find the existing rule by ID
        const rule = await Rule.findByPk(id);

        // Check if the rule exists
        if (!rule) {
            return res.status(404).json({ message: 'Rule not found' });
        }

        // Check if the new rule string is the same as the existing one
        if (ruleString === rule.rule_string) {
            return res.status(400).json({ message: 'New rule string is the same as the existing one. No changes made.' });
        }

        // Transform the rule string to AST
        const astRoot = transformToAST(ruleString);

        rule.name = name.trim() || rule.name; // Update name only if a new one is provided
        rule.rule_string = ruleString; // Update rule string
        rule.ast_root = JSON.stringify(astRoot);


        // Save the updated rule
        await rule.save();

        return res.status(200).json({
            message: 'Rule updated successfully.',
            astRoot,
        });
    } catch (error) {
        console.error('Error updating rule:', error);
        next(error);
        // return res.status(500).json({ message: 'Internal server error.' });
    }
};

