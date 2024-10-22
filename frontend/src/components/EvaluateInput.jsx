import { useState } from 'react';
import { fetchRuleById, evaluateInput } from '../api/ruleApi';

const EvaluateRule = () => {
    const [ruleId, setRuleId] = useState('');
    const [properties, setProperties] = useState([]);
    const [inputData, setInputData] = useState({});
    const [result, setResult] = useState(null);

    // Function to fetch rule by ID and retrieve properties
    const handleFetchRule = async () => {
        try {
            const rule = await fetchRuleById(ruleId);
            setProperties(rule.properties);
            // Initialize input fields for each property
            const initialInputData = rule.properties.reduce((acc, prop) => {
                acc[prop] = ''; // Set default value to empty string
                return acc;
            }, {});
            setInputData(initialInputData);
        } catch (error) {
            console.error('Error fetching rule:', error);
            setProperties([]);
        }
    };

    // Function to update the input data as the user enters values
    const handleInputChange = (property, value) => {
        setInputData({
            ...inputData,
            [property]: isNaN(value) ? value : Number(value), // Convert to number if applicable
        });
    };

    // Function to evaluate the rule with the input data
    const handleEvaluate = async () => {
        try {
            // Wrap the inputData in a userInput object for the backend API
            const requestBody = {
                ruleId: ruleId,
                userInput: inputData,
            };
            console.log(requestBody);  // To verify the format before sending the request
            const evaluationResult = await evaluateInput(requestBody);
            setResult(evaluationResult);
        } catch (error) {
            console.error('Error evaluating rule:', error);
            setResult({ message: 'Error evaluating rule.' });
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold">Evaluate Rule</h2>
            
            {/* Input for Rule ID */}
            <div className="mb-4">
                <input 
                    type="text" 
                    className="border p-2"
                    placeholder="Enter Rule ID"
                    value={ruleId}
                    onChange={(e) => setRuleId(e.target.value)}
                />
                <button className="bg-blue-500 text-white p-2 ml-2" onClick={handleFetchRule}>
                    Fetch Rule Properties
                </button>
            </div>
            
            {/* Display input fields dynamically based on the properties */}
            {properties.length > 0 && (
                <div className="mb-4 max-w-[15%]">
                    <h3 className="text-lg font-semibold">Enter Input Values:</h3>
                    {properties.map((property) => (
                        <div key={property} className="mb-2">
                            <label className="block text-sm font-medium">{property}</label>
                            <input
                                type="text"
                                className="border p-2 w-full"
                                placeholder={`Enter value for ${property}`}
                                value={inputData[property] || ''}
                                onChange={(e) => handleInputChange(property, e.target.value)}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Evaluate Button */}
            <button className="bg-red-500 text-white p-2" onClick={handleEvaluate}>
                Evaluate Rule
            </button>

            {/* Display evaluation result */}
            {result && (
                <div className="mt-4 p-2 bg-gray-100">
                    <h3 className="text-lg font-semibold">Evaluation Result:</h3>
                    <p>{result.evaluation   }</p>
                </div>
            )}
        </div>
    );
};

export default EvaluateRule;
