// rule-engine/backend/tests/evaluateRule.test.js
import request from 'supertest';
import app from '../index.js'; 

describe('POST /api/evaluateInput', () => {
    it('should evaluate the rule correctly for valid input', async () => {
        const response = await request(app)
            .post('/api/evaluateInput')
            .send({
                ruleId: 2, // Use the appropriate rule ID you want to test
                userInput: {
                    age: 32,
                    department: 'Marketing',
                    salary: 55000,
                    experience: 6
                }
            });

        expect(response.status).toBe(200);
        expect(response.body.result).toBe(true); // Adjust based on expected result
        expect(response.body.evaluation).toBe("The user input meets all conditions of the rule."); // Adjust this message if necessary
    });

    it('should return false for not matching conditions', async () => {
        const response = await request(app)
            .post('/api/evaluateInput')
            .send({
                ruleId: 2, // Use the appropriate rule ID you want to test
                userInput: {
                    age: 29,
                    department: 'Sales',
                    salary: 15000,
                    experience: 2
                }
            });

        expect(response.status).toBe(200);
        expect(response.body.result).toBe(false);
        expect(response.body.evaluation).toBe("The user input does not meet all conditions of the rule."); // Adjust this message if necessary
    });

    it('should return 404 for non-existing rule ID', async () => {
        const response = await request(app)
            .post('/api/evaluateInput')
            .send({
                ruleId: 9999, // Assuming this ID does not exist
                userInput: {
                    age: 32,
                    department: 'Marketing',
                    salary: 55000,
                    experience: 6
                }
            });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Rule not found');
    });
});
