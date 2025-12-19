import React, { useState } from 'react';
import { FileText, Send } from 'lucide-react';
import { classificationAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Classification = () => {
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
            const response = await classificationAPI.predict(text);
            setResult(response);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-6">
            <div className="flex items-center gap-3 mb-6">
                <FileText className="w-8 h-8 text-gold" />
                <h1 className="text-3xl font-serif font-bold text-primary">
                    Case Classification
                </h1>
            </div>

            <p className="text-gray-600 mb-8 font-serif">
                Automatically classify legal cases into: <strong>Civil</strong>, <strong>Criminal</strong>, or <strong>Constitutional</strong>
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
                            Classify Case
                        </>
                    )}
                </button>
            </form>

            {loading && <LoadingSpinner message="Analyzing case..." />}

            {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {error}
                </div>
            )}

            {result && (
                <div className="mt-6 bg-white border-2 border-gold rounded-xl p-6 shadow-lg">
                    <h2 className="text-xl font-serif font-bold text-primary mb-3">
                        Classification Result
                    </h2>
                    <div className="flex items-center gap-3">
                        <span className="text-gray-600">Category:</span>
                        <span className="text-2xl font-bold text-gold">{result.category}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Classification;
