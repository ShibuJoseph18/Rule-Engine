import app from '../index.js'; // Assuming you have your express app exported here
import request from 'supertest';  // Import the request function from supertest


describe('POST /api/createRule', () => {
    it('should create a new rule and verify its AST representation for a complex rule', async () => {
        const response = await request(app)
            .post('/api/createRule')
            .send({ 
                name: 'Complex Rule', 
                ruleString: '((age > 30 AND department = \'Marketing\')) AND (salary > 20000 OR experience > 5)' 
            });
    
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Rule created successfully');
    
        const ast = response.body.rule.ast_root;
    
        // Validate the outermost "AND" operator
        expect(ast).toHaveProperty('type', 'operator');
        expect(ast).toHaveProperty('value', 'AND');
    
        // Check the left side of the outer "AND" operator (age > 30 AND department = 'Marketing')
        const leftSide = ast.left;
        expect(leftSide).toHaveProperty('type', 'operator');
        expect(leftSide).toHaveProperty('value', 'AND');
        
        // Check the left operand of the inner "AND" (age > 30)
        const ageCondition = leftSide.left;
        expect(ageCondition).toHaveProperty('type', 'operand');
        expect(ageCondition).toHaveProperty('value', 'age > 30');
    
        // Check the right operand of the inner "AND" (department = 'Marketing')
        const departmentCondition = leftSide.right;
        expect(departmentCondition).toHaveProperty('type', 'operand');
        expect(departmentCondition).toHaveProperty('value', "department = 'Marketing'");
    
        // Check the right side of the outer "AND" operator (salary > 20000 OR experience > 5)
        const rightSide = ast.right;
        expect(rightSide).toHaveProperty('type', 'operator');
        expect(rightSide).toHaveProperty('value', 'OR');
    
        // Check the left operand of the "OR" (salary > 20000)
        const salaryCondition = rightSide.left;
        expect(salaryCondition).toHaveProperty('type', 'operand');
        expect(salaryCondition).toHaveProperty('value', 'salary > 20000');
    
        // Check the right operand of the "OR" (experience > 5)
        const experienceCondition = rightSide.right;
        expect(experienceCondition).toHaveProperty('type', 'operand');
        expect(experienceCondition).toHaveProperty('value', 'experience > 5');
    });
});    