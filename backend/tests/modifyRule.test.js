import app from '../index.js'; // Assuming your express app is exported here
import request from 'supertest';  // For sending HTTP requests in tests
import Rule from '../models/Rule.js';


describe('PUT /api/modifyRuleById/:id', () => {
  it('should update the rule successfully and return the updated AST', async () => {
    const sampleRuleId = 5;
    const response = await request(app)
      .put(`/api/modifyRuleById/${sampleRuleId}`)
      .send({
        name: `Modified Rule ${sampleRuleId}`,
        ruleString: "age > 26 AND department = 'Sales'"
      });

    const ast = response.body.astRoot;
    // Assertions
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Rule updated successfully.');

    expect(ast).toHaveProperty('value', 'AND');
    // Check the outermost operator (AND)
    expect(ast).toHaveProperty('type', 'operator');
    expect(ast).toHaveProperty('value', 'AND');

    // Check the left operand of the outer "AND" (age > 26)
    const leftSide = ast.left;
    expect(leftSide).toHaveProperty('type', 'operand');
    expect(leftSide).toHaveProperty('value', 'age > 26');

    // Check the right operand of the outer "AND" (department = 'Sales')
    const rightSide = ast.right;
    expect(rightSide).toHaveProperty('type', 'operand');
    expect(rightSide).toHaveProperty('value', "department = 'Sales'");

    // Ensure the "left" and "right" properties are null for both operands (as they are leaf nodes)
    expect(leftSide).toHaveProperty('left', null);
    expect(leftSide).toHaveProperty('right', null);

    expect(rightSide).toHaveProperty('left', null);
    expect(rightSide).toHaveProperty('right', null);


    // Verify that the rule was updated in the database
    const updatedRule = await Rule.findByPk(sampleRuleId);
    expect(updatedRule.name).toBe(`Modified Rule ${sampleRuleId}`);
    expect(updatedRule.rule_string).toBe("age > 26 AND department = 'Sales'");
  });

  it('should return 400 if the rule string is empty or null', async () => {
    const sampleRuleId = 5;
    const response = await request(app)
      .put(`/api/modifyRuleById/${sampleRuleId}`)
      .send({
        name: 'New Rule Name',
        ruleString: '' // Empty rule string
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Rule string cannot be null or empty.');
  });

  it('should return 404 if the rule does not exist', async () => {
    const response = await request(app)
      .put(`/api/modifyRuleById/999`) // Non-existing rule ID
      .send({
        name: 'Non-Existing Rule',
        ruleString: "age > 30 AND department = 'HR'"
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Rule not found');
  });

  it('should return 400 if the new rule string is the same as the existing one', async () => {
    const sampleRuleId = 6;
    const response = await request(app)
      .put(`/api/modifyRuleById/${sampleRuleId}`)
      .send({
        name: 'Same Rule',
        ruleString: "age < 30 OR department = 'Sales'" // Same as the existing one
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('New rule string is the same as the existing one. No changes made.');
  });

//   it('should handle server errors and return 500', async () => {
//     Rule.findByPk.mockRejectedValue(new Error('Database error')); // Simulate a database error

//     const response = await request(app)
//       .put(`/api/rules/${sampleRule.id}`)
//       .send({
//         name: 'Error Rule',
//         ruleString: "age > 30 AND department = 'HR'"
//       });

//     expect(response.status).toBe(500);
//     expect(response.body.message).toBe('Internal server error while updating rule');
//   });
});
