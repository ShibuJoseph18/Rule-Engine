import Rule from '../models/Rule.js';

const fetchAllRules = async (req, res, next) => {
    try {
        // Fetch all rules from the database
        const rules = await Rule.findAll();
        res.status(200).json(rules); // Return the rules as a JSON response
    } catch (error) {
        console.error('Error fetching rules:', error);
        res.status(500).json({ message: 'Failed to fetch rules from the database.' });
    }
};

const fetchRuleById = async (req, res, next) => {
    const { id } = req.params; // Get the rule ID from the URL

    try {
        // Fetch the rule by ID from the database
        const rule = await Rule.findByPk(id);

        // If the rule doesn't exist, return a 404 error
        if (!rule) {
            return res.status(404).json({ message: 'Rule not found' });
        }

        // If the rule exists, return the rule as a JSON response
        res.status(200).json(rule);
    } catch (error) {
        console.error('Error fetching rule by ID:', error);
        res.status(500).json({ message: 'Failed to fetch rule by ID.' });
    }
};

export {fetchAllRules, fetchRuleById};