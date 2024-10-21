import app from '../index.js'; // Assuming your express app is exported here
import request from 'supertest';  // For sending HTTP requests in tests
import Rule from '../models/Rule.js'; // ORM model to access database

describe('POST /api/combineRules', () => {
    // Helper function to reset the database before running tests
    // const resetDatabase = async () => {
    //     // Truncate the rules table and reset the auto-increment counter
    //     await Rule.destroy({ where: {}, truncate: true, restartIdentity: true });
    // };

    // // Before each test, reset the database
    // beforeEach(async () => {
    //     await resetDatabase();
    // });

    it('should combine two rules and return the combined AST successfully', async () => {
        const ruleIds = [3, 4];

        // Send request to combine the rules
        const response = await request(app)
            .post('/api/combineRules')
            .send({
                ruleIds: ruleIds,
                combinedRuleName: 'Test Combine R3-R4'
            });

        // Validate response status and message
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Rules combined successfully');

        // Validate combined rule data
        const combinedRule = response.body.combinedRule;
        expect(combinedRule.id).toBe(`${ruleIds[0]}-${ruleIds[1]}`);

        // Validate the combined AST structure
        const ast = combinedRule.ast;
        expect(ast.type).toBe('operator');
        expect(ast.value).toBe('AND');

        // Check the left part of the outer "AND" operator
        const leftPart = ast.left;
        expect(leftPart.type).toBe('operator');
        expect(leftPart.value).toBe('AND');

        // Check the operands on the left side (age > 30 AND department = 'Sales')
        const ageCondition = leftPart.left.left;
        expect(ageCondition.type).toBe('operand');
        expect(ageCondition.value).toBe('age > 30');

        const departmentCondition = leftPart.left.right;
        expect(departmentCondition.type).toBe('operand');
        expect(departmentCondition.value).toBe("department = 'Sales'");

        // Check the right operand of the left "AND" (salary > 50000)
        const salaryCondition = leftPart.right;
        expect(salaryCondition.type).toBe('operand');
        expect(salaryCondition.value).toBe('salary > 50000');

        // Check the right part of the outer "AND" (experience > 5)
        const experienceCondition = ast.right;
        expect(experienceCondition.type).toBe('operand');
        expect(experienceCondition.value).toBe('experience > 5');
    });

    it('should return 400 error if rule IDs are not provided', async () => {
        const response = await request(app)
            .post('/api/combineRules')
            .send({ combinedRuleName: 'Combine without IDs' });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Both rule IDs array and combined rule name are required');
    });

    it('should return 400 error if fewer than two rules are provided', async () => {

        const response = await request(app)
            .post('/api/combineRules')
            .send({ ruleIds: [1], combinedRuleName: 'Combine with 1 rule' });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('At least two rules are required for combination');
    });

    it('should return 400 error if one or more rule IDs are not found in the database', async () => {
        const response = await request(app)
            .post('/api/combineRules')
            .send({
                ruleIds: [999, 1000], // Non-existing rule IDs
                combinedRuleName: 'Invalid Rules Combination'
            });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('One or more rules not found in the database');
    });

    // it('should return 400 error if the rule combination already exists', async () => {

    //     // Try combining the rules again, expecting a conflict
    //     const response = await request(app)
    //         .post('/api/combineRules')
    //         .send({ ruleIds: [3,4], combinedRuleName: 'Duplicate Combination' });

    //     expect(response.status).toBe(400);
    //     expect(response.body.success).toBe(false);
    //     expect(response.body.message).toBe('This combination of rules already exists');
    // });
});
