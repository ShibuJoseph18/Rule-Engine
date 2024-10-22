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

        // Assuming rule properties are in the 'rule_string' field
        const ruleString = rule.rule_string;

        // Use a regex to capture properties with various operators and conditions
        const propertyRegex = /\b(\w+)\s*(=|>|<|>=|<=|!=)\s*('[^']*'|\d+(\.\d+)?)/g;
        const propertiesSet = new Set(); // Use Set to automatically handle duplicates

        let match;

        // Loop through all matches and add unique properties to the Set
        while ((match = propertyRegex.exec(ruleString)) !== null) {
            propertiesSet.add(match[1]); // Add the property name (e.g., "age", "salary", "department")
        }

        // Convert the Set to an array of unique properties
        const properties = Array.from(propertiesSet);

        // Respond with the rule data and the extracted properties
        res.status(200).json({
            ruleId: rule.id,
            ruleName: rule.name,
            ruleString: rule.rule_string,
            properties,  // Return the unique properties as an array
        });
    } catch (error) {
        console.error('Error fetching rule by ID:', error);
        res.status(500).json({ message: 'Failed to fetch rule by ID.' });
    }
};


export {fetchAllRules, fetchRuleById};