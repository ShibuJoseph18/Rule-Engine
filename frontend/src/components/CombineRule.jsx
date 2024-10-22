import { useState } from 'react';
import { combineRules } from '../api/ruleApi';

const CombineRules = ({ onRulesCombined }) => {
    const [ruleIds, setRuleIds] = useState('');
    const [combinedRuleName, setCombinedRuleName] = useState('');
    const [response, setResponse] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const idsArray = ruleIds.split(',').map(id => parseInt(id.trim())); // Convert to an array of integers
        const payload = {
            ruleIds: idsArray,
            combinedRuleName,
        };
        const result = await combineRules(payload);
        setResponse(result);
        onRulesCombined();
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold">Combine Rules</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Rule IDs (comma separated)"
                    value={ruleIds}
                    onChange={(e) => setRuleIds(e.target.value)}
                    className="p-2 border"
                />
                <input
                    type="text"
                    placeholder="Combined Rule Name"
                    value={combinedRuleName}
                    onChange={(e) => setCombinedRuleName(e.target.value)}
                    className="ml-2 p-2 border"
                />
                <button type="submit" className="ml-2 p-2 bg-green-500 text-white">Combine Rules</button>
            </form>
            {response && <div className="mt-2">{response.message}</div>}
        </div>
    );
};

export default CombineRules;
