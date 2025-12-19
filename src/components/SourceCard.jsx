import React, { useState } from 'react';
import { FileText, ChevronDown, ChevronUp } from 'lucide-react';

const SourceCard = ({ source, index }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-3">
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                    <FileText className="w-5 h-5 text-gold mt-1 flex-shrink-0" />
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-primary">Source {index + 1}</span>
                            <span className="text-sm text-gray-500">
                                Relevance: {(source.score * 100).toFixed(1)}%
                            </span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            {isExpanded ? source.content : `${source.content.substring(0, 200)}...`}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="ml-2 text-primary hover:text-gold transition-colors"
                >
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
            </div>
        </div>
    );
};

export default SourceCard;
