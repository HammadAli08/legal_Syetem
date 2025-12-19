import React from 'react';

const LoadingSpinner = ({ message = 'Processing...' }) => {
    return (
        <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mb-4"></div>
            <p className="text-gray-600 font-serif">{message}</p>
        </div>
    );
};

export default LoadingSpinner;
