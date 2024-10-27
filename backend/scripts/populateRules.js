// scripts/insertRules.js
import sequelize from '../config/database.js'; // Sequelize connection setup
import Rule from '../models/Rule.js';
import transformToAST from '../services/parser.js';
import storeAstInDb from '../services/storeAstInDb.js';

// Function to insert rules
const insertRules = async () => {
    try {
        // Sync the database and create the table if it doesn't exist
        await Rule.sync();  // This creates the table if it does not exist

        // Data to insert
        const rules = [
            {
                name: 'TestRule1',
                rule_string: "((age > 30 AND department = 'Sales') OR (age < 25 AND department = 'Marketing')) AND (salary > 50000 OR experience > 5)"
            },
            {
                name: 'TestRule2',
                rule_string: "((age > 30 AND department = 'Marketing')) AND (salary > 20000 OR experience > 5)"
            },
            {
                name: 'TestRule3',
                rule_string: "age > 26 AND department = 'Sales'"
            },
            {
                name: 'TestRule4',
                rule_string: "salary > 50000 AND experience > 5"
            },
            {
                name: 'TestRule5',
                rule_string: "location = 'Bangalore' AND occupation = 'Engineer'"
            },
            {
                name: 'TestRule6',
                rule_string: "income > 90000 OR spend < 20000"
            }
        ];

        // Insert rules into the database
        for (const rule of rules) {
            // Transform the rule string to AST
            const astRoot = transformToAST(rule.rule_string);

            // Check if the transformation was successful
            if (!astRoot) {
                console.error(`AST transformation failed for rule: ${rule.name}`);
                continue; // Skip to the next rule
            }

            // Store the rule in the database using storeAstInDb
            await storeAstInDb(rule.name, rule.rule_string, astRoot);
            console.log(`Inserted: ${rule.name}`);
        }

        console.log('All rules inserted successfully.');
    } catch (error) {
        console.error('Error inserting rules:', error);
    } finally {
        // Close the connection to the database
        await sequelize.close();
    }
};

// Run the insert function
insertRules();
