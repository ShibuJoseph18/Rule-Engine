import { useState } from 'react';
import RuleTable from './components/RuleTable';
import AddRule from './components/AddRule';
import ModifyRule from './components/ModifyRule';
import CombineRules from './components/CombineRule';
import EvaluateInput from './components/EvaluateInput';

const App = () => {
    const [rulesUpdated, setRulesUpdated] = useState(false);

    const handleRuleUpdate = () => {
        // Trigger re-fetch of the rules whenever an update occurs
        setRulesUpdated(prev => !prev);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-center mb-6">Rule Engine Manager</h1>

            <RuleTable rulesUpdated={rulesUpdated} />

            <div className="flex flex-col space-y-6 mt-6">

                {/* Add New Rule */}
                <AddRule onRuleAdded={handleRuleUpdate} />

                {/* Evaluate Input */}
                <EvaluateInput rules={rulesUpdated} />

                {/* Modify Rule */}
                <ModifyRule onRuleModified={handleRuleUpdate} />

                {/* Combine Rules */}
                <CombineRules onRulesCombined={handleRuleUpdate} />

            </div>
            
        </div>
    );
};

export default App;
