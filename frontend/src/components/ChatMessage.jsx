import React from 'react';
import { User, Bot } from 'lucide-react';

const ChatMessage = ({ message, isUser }) => {
    return (
        <div className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
            {!isUser && (
                <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center flex-shrink-0">
                    <Bot className="w-6 h-6 text-primary" />
                </div>
            )}

            <div
                className={`max-w-3xl rounded-2xl px-6 py-4 ${isUser
                        ? 'bg-primary text-white'
                        : 'bg-white border border-gray-200 shadow-sm'
                    }`}
            >
                <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-wrap">{message}</div>
                </div>
            </div>

            {isUser && (
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-white" />
                </div>
            )}
        </div>
    );
};

export default ChatMessage;
