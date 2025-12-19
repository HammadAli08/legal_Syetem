import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Classification from './pages/Classification';
import Prioritization from './pages/Prioritization';
import LegalAssistant from './pages/LegalAssistant';

function App() {
    const [currentPage, setCurrentPage] = useState('home');

    const handleClearChat = () => {
        if (window.confirm('Are you sure you want to clear chat history?')) {
            setCurrentPage('home');
            setTimeout(() => setCurrentPage('chat'), 0);
        }
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <Home />;
            case 'classification':
                return <Classification />;
            case 'prioritization':
                return <Prioritization />;
            case 'chat':
                return <LegalAssistant onClearChat={handleClearChat} />;
            default:
                return <Home />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar
                currentPage={currentPage}
                onNavigate={setCurrentPage}
                onClearChat={handleClearChat}
            />
            <main className="flex-1 overflow-y-auto">
                {renderPage()}
            </main>
        </div>
    );
}

export default App;
