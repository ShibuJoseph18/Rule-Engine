import app from '../index.js'; // Assuming your express app is exported here
import request from 'supertest';  // For sending HTTP requests in tests
import Rule from '../models/Rule.js';


describe('PUT /api/modifyRuleById/:id', () => {
  it('should update the rule successfully and return the updated rule from the database', async () => {
    const sampleRuleId = 6;
    const updatedRuleData = {
      name: `Modified Test Rule ${sampleRuleId}`,
      ruleString: "income > 90000 OR spend < 20000"
    };

    // Send the PUT request to modify the rule
    const response = await request(app)
      .put(`/api/modifyRuleById/${sampleRuleId}`)
      .send(updatedRuleData);

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Rule updated successfully.');

    // Verify that the rule was updated in the database
    const updatedRule = await Rule.findByPk(sampleRuleId);
    expect(updatedRule.dataValues.name).toBe(updatedRuleData.name);
    expect(updatedRule.dataValues.rule_string).toBe(updatedRuleData.ruleString);

    // Ensure the response from the API matches the updated rule in the database
    expect(response.body.name).toBe(updatedRuleData.name);
    expect(response.body.ruleString).toBe(updatedRuleData.ruleString);
  });
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
