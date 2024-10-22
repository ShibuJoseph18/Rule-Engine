import { useState } from 'react';
import { addRule } from '../api/ruleApi.js';

const AddRule = ({onRuleAdded}) => {
    const [name, setName] = useState('');
    const [ruleString, setRuleString] = useState('');
    const [response, setResponse] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await addRule({ name, ruleString });
        setResponse(result);
        onRuleAdded(); // Trigger re-fetch in parent component
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold">Add New Rule</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Rule Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="p-2 border"
                />
                <input
                    type="text"
                    placeholder="Rule String"
                    value={ruleString}
                    onChange={(e) => setRuleString(e.target.value)}
                    className="p-2 border ml-2"
                />
                <button type="submit" className="ml-2 p-2 bg-blue-500 text-white">Add Rule</button>
            </form>
            {response && <div className="mt-2">{response.message}</div>}


        </div>
    );
};

export default AddRule;
