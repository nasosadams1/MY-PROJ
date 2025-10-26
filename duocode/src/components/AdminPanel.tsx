import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface Problem {
  id?: string;
  title: string;
  statement: string;
  difficulty: 'easy' | 'medium' | 'hard';
  time_limit_seconds: number;
  memory_limit_mb: number;
  supported_languages: string[];
  test_cases: TestCase[];
  tags: string[];
  is_active: boolean;
}

interface TestCase {
  input: string;
  expected_output: string;
  weight: number;
  hidden: boolean;
}

export default function AdminPanel() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadProblems();
  }, []);

  const loadProblems = async () => {
    const { data, error } = await supabase
      .from('problems')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load problems');
      console.error(error);
    } else {
      setProblems(data || []);
    }
  };

  const handleCreate = () => {
    setEditingProblem({
      title: '',
      statement: '',
      difficulty: 'medium',
      time_limit_seconds: 900,
      memory_limit_mb: 256,
      supported_languages: ['javascript', 'python'],
      test_cases: [
        { input: '', expected_output: '', weight: 1, hidden: false }
      ],
      tags: [],
      is_active: true
    });
    setIsCreating(true);
  };

  const handleSave = async () => {
    if (!editingProblem) return;

    if (!editingProblem.title || !editingProblem.statement) {
      toast.error('Title and statement are required');
      return;
    }

    if (editingProblem.test_cases.length === 0) {
      toast.error('At least one test case is required');
      return;
    }

    try {
      if (isCreating) {
        const { error } = await supabase
          .from('problems')
          .insert({
            ...editingProblem,
            supported_languages: editingProblem.supported_languages,
            test_cases: editingProblem.test_cases
          });

        if (error) throw error;
        toast.success('Problem created successfully');
      } else {
        const { error } = await supabase
          .from('problems')
          .update({
            ...editingProblem,
            supported_languages: editingProblem.supported_languages,
            test_cases: editingProblem.test_cases
          })
          .eq('id', editingProblem.id);

        if (error) throw error;
        toast.success('Problem updated successfully');
      }

      setEditingProblem(null);
      setIsCreating(false);
      loadProblems();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save problem');
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this problem?')) return;

    const { error } = await supabase
      .from('problems')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete problem');
      console.error(error);
    } else {
      toast.success('Problem deleted');
      loadProblems();
    }
  };

  const addTestCase = () => {
    if (!editingProblem) return;
    setEditingProblem({
      ...editingProblem,
      test_cases: [
        ...editingProblem.test_cases,
        { input: '', expected_output: '', weight: 1, hidden: false }
      ]
    });
  };

  const updateTestCase = (index: number, field: keyof TestCase, value: any) => {
    if (!editingProblem) return;
    const newTestCases = [...editingProblem.test_cases];
    newTestCases[index] = { ...newTestCases[index], [field]: value };
    setEditingProblem({ ...editingProblem, test_cases: newTestCases });
  };

  const removeTestCase = (index: number) => {
    if (!editingProblem) return;
    const newTestCases = editingProblem.test_cases.filter((_, i) => i !== index);
    setEditingProblem({ ...editingProblem, test_cases: newTestCases });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Problem Management</h1>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Create Problem
          </button>
        </div>

        {editingProblem && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {isCreating ? 'Create New Problem' : 'Edit Problem'}
              </h2>
              <button
                onClick={() => {
                  setEditingProblem(null);
                  setIsCreating(false);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editingProblem.title}
                  onChange={(e) => setEditingProblem({ ...editingProblem, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Two Sum"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Problem Statement
                </label>
                <textarea
                  value={editingProblem.statement}
                  onChange={(e) => setEditingProblem({ ...editingProblem, statement: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={6}
                  placeholder="Given an array of integers..."
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Difficulty
                  </label>
                  <select
                    value={editingProblem.difficulty}
                    onChange={(e) => setEditingProblem({ ...editingProblem, difficulty: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time Limit (seconds)
                  </label>
                  <input
                    type="number"
                    value={editingProblem.time_limit_seconds}
                    onChange={(e) => setEditingProblem({ ...editingProblem, time_limit_seconds: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Memory Limit (MB)
                  </label>
                  <input
                    type="number"
                    value={editingProblem.memory_limit_mb}
                    onChange={(e) => setEditingProblem({ ...editingProblem, memory_limit_mb: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test Cases
                </label>
                <div className="space-y-3">
                  {editingProblem.test_cases.map((testCase, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700">Test Case {index + 1}</span>
                        <button
                          onClick={() => removeTestCase(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-2">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Input</label>
                          <input
                            type="text"
                            value={testCase.input}
                            onChange={(e) => updateTestCase(index, 'input', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="[2,7,11,15], 9"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Expected Output</label>
                          <input
                            type="text"
                            value={testCase.expected_output}
                            onChange={(e) => updateTestCase(index, 'expected_output', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="[0,1]"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-gray-600">Weight:</label>
                          <input
                            type="number"
                            value={testCase.weight}
                            onChange={(e) => updateTestCase(index, 'weight', parseInt(e.target.value))}
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>
                        <label className="flex items-center gap-2 text-xs text-gray-600">
                          <input
                            type="checkbox"
                            checked={testCase.hidden}
                            onChange={(e) => updateTestCase(index, 'hidden', e.target.checked)}
                            className="rounded"
                          />
                          Hidden Test
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={addTestCase}
                  className="mt-3 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                >
                  Add Test Case
                </button>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingProblem.is_active}
                    onChange={(e) => setEditingProblem({ ...editingProblem, is_active: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Active</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingProblem(null);
                    setIsCreating(false);
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Difficulty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tests
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {problems.map((problem) => (
                <tr key={problem.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{problem.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      problem.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                      problem.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {problem.test_cases.length} test cases
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      problem.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {problem.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        setEditingProblem(problem);
                        setIsCreating(false);
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(problem.id!)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {problems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No problems yet. Create your first problem!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
