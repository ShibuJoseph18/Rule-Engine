import { useState } from 'react';
import { modifyRule } from '../api/ruleApi.js';

const ModifyRule = ({ onRuleModified }) => {
    const [ruleId, setRuleId] = useState('');
    const [name, setName] = useState('');
    const [ruleString, setRuleString] = useState('');
    const [response, setResponse] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await modifyRule(ruleId, { name, ruleString });
        setResponse(result);
        onRuleModified(); // Trigger re-fetch in parent component
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold">Modify Rule</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Rule ID"
                    value={ruleId}
                    onChange={(e) => setRuleId(e.target.value)}
                    className="p-2 border"
                />
                <input
                    type="text"
                    placeholder="New Rule Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="p-2 border ml-2"
                />
                <input
                    type="text"
                    placeholder="New Rule String"
                    value={ruleString}
                    onChange={(e) => setRuleString(e.target.value)}
                    className="p-2 border ml-2"
                />
                <button type="submit" className="ml-2 p-2 bg-yellow-500 text-white">Modify Rule</button>
            </form>
            {response && <div className="mt-2">{response.message}</div>}
        </div>
    );
};

export default ModifyRule;
