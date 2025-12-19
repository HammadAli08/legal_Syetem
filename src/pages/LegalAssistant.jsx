import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { chatAPI } from '../services/api';
import ChatMessage from '../components/ChatMessage';
import SourceCard from '../components/SourceCard';
import LoadingSpinner from '../components/LoadingSpinner';

const LegalAssistant = ({ onClearChat }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [sources, setSources] = useState([]);
    const [showSources, setShowSources] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setLoading(true);
        setSources([]);
        setShowSources(false);

        try {
            const chatHistory = messages.map((msg) => ({
                role: msg.role,
                content: msg.content,
            }));

            const response = await chatAPI.ask(input, chatHistory);

            const assistantMessage = { role: 'assistant', content: response.answer };
            setMessages((prev) => [...prev, assistantMessage]);
            setSources(response.sources || []);
        } catch (err) {
            const errorMessage = {
                role: 'assistant',
                content: `Error: ${err.message}`,
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full max-w-5xl mx-auto">
            <div className="flex items-center justify-between py-6 px-6 border-b border-gray-200 bg-white">
                <div className="flex items-center gap-3">
                    <MessageSquare className="w-8 h-8 text-gold" />
                    <h1 className="text-3xl font-serif font-bold text-primary">
                        Legal Research Assistant
                    </h1>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 bg-gray-50">
                {messages.length === 0 ? (
                    <div className="text-center py-12">
                        <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-serif font-bold text-gray-400 mb-2">
                            Start a Legal Research Session
                        </h2>
                        <p className="text-gray-500 font-serif">
                            Ask questions about legal precedents, case law, or statutory interpretations
                        </p>
                    </div>
                ) : (
                    <>
                        {messages.map((msg, idx) => (
                            <ChatMessage
                                key={idx}
                                message={msg.content}
                                isUser={msg.role === 'user'}
                            />
                        ))}

                        {loading && (
                            <div className="flex justify-start mb-4">
                                <LoadingSpinner message="Researching legal precedents..." />
                            </div>
                        )}

                        {sources.length > 0 && (
                            <div className="mt-6 mb-4">
                                <button
                                    onClick={() => setShowSources(!showSources)}
                                    className="text-gold hover:text-gold-dark font-semibold mb-3 flex items-center gap-2"
                                >
                                    📚 {showSources ? 'Hide' : 'View'} Sources ({sources.length})
                                </button>
                                {showSources && (
                                    <div className="space-y-3">
                                        {sources.map((source, idx) => (
                                            <SourceCard key={idx} source={source} index={idx} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            <div className="border-t border-gray-200 bg-white px-6 py-4">
                <form onSubmit={handleSubmit} className="flex gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a legal question..."
                        disabled={loading}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent font-serif disabled:bg-gray-100"
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="bg-gold hover:bg-gold-dark text-primary font-bold px-6 py-3 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        <Send className="w-5 h-5" />
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LegalAssistant;
