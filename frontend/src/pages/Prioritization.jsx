import React, { useState } from 'react';
import { AlertCircle, Send } from 'lucide-react';
import { prioritizationAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Prioritization = () => {
    const [text, setText] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!text.trim()) {
            setError('Please enter case text');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await prioritizationAPI.predict(text);
            setResult(response);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getPriorityColor = (priority) => {
        const colors = {
            High: 'text-red-600 bg-red-50 border-red-200',
            Medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
            Low: 'text-green-600 bg-green-50 border-green-200',
        };
        return colors[priority] || 'text-gray-600 bg-gray-50 border-gray-200';
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-6">
            <div className="flex items-center gap-3 mb-6">
                <AlertCircle className="w-8 h-8 text-gold" />
                <h1 className="text-3xl font-serif font-bold text-primary">
                    Case Prioritization
                </h1>
            </div>

            <p className="text-gray-600 mb-8 font-serif">
                Determine case urgency: <strong>High</strong>, <strong>Medium</strong>, or <strong>Low</strong> priority
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-primary mb-2">
                        Case Text
                    </label>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Paste the legal case text here..."
                        className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent resize-none font-serif"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gold hover:bg-gold-dark text-primary font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {loading ? (
                        <>Processing...</>
                    ) : (
                        <>
                            <Send className="w-5 h-5" />
                            Determine Priority
                        </>
                    )}
                </button>
            </form>

            {loading && <LoadingSpinner message="Analyzing urgency..." />}

            {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {error}
                </div>
            )}

            {result && (
                <div className="mt-6 bg-white border-2 border-gold rounded-xl p-6 shadow-lg">
                    <h2 className="text-xl font-serif font-bold text-primary mb-3">
                        Prioritization Result
                    </h2>
                    <div className={`inline-block px-6 py-3 rounded-lg border-2 ${getPriorityColor(result.priority)}`}>
                        <span className="text-2xl font-bold">{result.priority} Priority</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Prioritization;
