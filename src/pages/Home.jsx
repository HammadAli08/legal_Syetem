import React from 'react';
import { Scale, FileText, AlertCircle, MessageSquare } from 'lucide-react';

const Home = () => {
    return (
        <div className="max-w-5xl mx-auto py-12 px-6">
            <div className="text-center mb-12">
                <div className="flex justify-center mb-6">
                    <Scale className="w-20 h-20 text-gold" />
                </div>
                <h1 className="text-4xl font-serif font-bold text-primary mb-4">
                    AI-Powered Legal Case Management
                </h1>
                <p className="text-lg text-gray-600 font-serif">
                    Streamline your legal workflow with intelligent case classification,
                    prioritization, and precedent research.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
                <FeatureCard
                    icon={<FileText className="w-8 h-8" />}
                    title="Case Classification"
                    description="Automatically categorize cases as Civil, Criminal, or Constitutional using advanced ML models."
                />
                <FeatureCard
                    icon={<AlertCircle className="w-8 h-8" />}
                    title="Case Prioritization"
                    description="Determine urgency levels (High, Medium, Low) to optimize case management workflow."
                />
                <FeatureCard
                    icon={<MessageSquare className="w-8 h-8" />}
                    title="Legal Assistant"
                    description="Chat with an AI trained on legal precedents with context-aware responses."
                />
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-gold">
                <h2 className="text-2xl font-serif font-bold text-primary mb-4">
                    Getting Started
                </h2>
                <ol className="space-y-3 text-gray-700">
                    <li className="flex gap-3">
                        <span className="font-bold text-gold">1.</span>
                        <span>Select a tool from the sidebar menu</span>
                    </li>
                    <li className="flex gap-3">
                        <span className="font-bold text-gold">2.</span>
                        <span>Input your case text or legal query</span>
                    </li>
                    <li className="flex gap-3">
                        <span className="font-bold text-gold">3.</span>
                        <span>Receive AI-powered insights and recommendations</span>
                    </li>
                </ol>
            </div>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => {
    return (
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow border border-gray-100">
            <div className="text-gold mb-4">{icon}</div>
            <h3 className="text-xl font-serif font-bold text-primary mb-2">{title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
        </div>
    );
};

export default Home;
