import axios from 'axios';

const apiBaseUrl = 'http://localhost:3000/api'; // Update base URL if needed

export const fetchAllRules = async () => {
    const response = await axios.get(`${apiBaseUrl}/fetchAllRules`);
    return response.data;
};

export const addRule = async (ruleData) => {
    const response = await axios.post(`${apiBaseUrl}/createRule`, ruleData);
    return response.data;
};

export const modifyRule = async (ruleId, ruleData) => {
    const response = await axios.put(`${apiBaseUrl}/modifyRuleById/${ruleId}`, ruleData);
    return response.data;
};

export const combineRules = async (ruleIds) => {
    const response = await axios.post(`${apiBaseUrl}/combineRules`, ruleIds);
    return response.data;
};

export const evaluateInput = async (inputData) => {
    const response = await axios.post(`${apiBaseUrl}/evaluateInput`, inputData);
    return response.data;
};

// Fetch rule by ID to get properties
export const fetchRuleById = async (ruleId) => {
    const response = await axios.get(`${apiBaseUrl}/fetchRuleById/${ruleId}`);
    return response.data;
};
