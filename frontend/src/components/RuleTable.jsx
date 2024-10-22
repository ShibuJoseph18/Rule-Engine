import { useEffect, useState } from 'react';
import { fetchAllRules } from '../api/ruleApi.js';

const RuleTable = ({ rulesUpdated }) => {
    const [rules, setRules] = useState([]);

    useEffect(() => {
        const fetchRules = async () => {
            const fetchedRules = await fetchAllRules();
            
            // Sort fetched rules by their ID or another property to ensure consistency.
            const sortedRules = fetchedRules.sort((a, b) => a.id - b.id);

            // Set the rules, avoiding duplicates
            setRules((prevRules) => [...prevRules, ...sortedRules.filter(rule => !prevRules.some(r => r.id === rule.id))]);
        };
        fetchRules();
    }, [rulesUpdated]);

    return (
        <div className="fixed top-0 right-0 p-4 max-h-screen">
          <div className="rounded-lg p-8 max-w-3xl w-full flex flex-col max-h-[calc(100vh-2rem)]">
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Rules Table</h1>
            <div className="overflow-auto flex-grow">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead className="sticky top-0 bg-white">
                  <tr className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Rule String</th>
                  </tr>
                </thead>
                <tbody>
                  {rules.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center py-4">No rules found</td>
                    </tr>
                  ) : (
                    rules.map((rule) => (
                      <tr key={rule.id} className="hover:bg-blue-100 transition-all duration-300">
                        <td className="border border-gray-300 px-4 py-2">{rule.id}</td>
                        <td className="border border-gray-300 px-4 py-2 text-blue-600">{rule.name}</td>
                        <td className="border border-gray-300 px-4 py-2">{rule.rule_string}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
    );
};

export default RuleTable;
