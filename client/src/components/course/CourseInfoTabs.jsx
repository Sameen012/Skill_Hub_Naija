import React, { useState } from 'react';

const CourseInfoTabs = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'curriculum', label: 'Curriculum' },
    { id: 'outcomes', label: 'Outcomes' }
  ];

  return (
    <div className="mt-8 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Tab Header */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
              activeTab === tab.id 
                ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6 min-h-[200px]">
        {activeTab === 'overview' && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-lg font-bold text-gray-900">Course Description</h3>
            <p className="text-gray-600 leading-relaxed">
              This comprehensive course takes you from absolute beginner to industry-ready professional. 
              We cover the fundamental concepts, best practices, and real-world tools used by top tech companies.
            </p>
            <div className="flex gap-4 mt-4">
              <Badge label="Beginner Friendly" color="bg-green-100 text-green-800" />
              <Badge label="20 Hours" color="bg-blue-100 text-blue-800" />
              <Badge label="Certificate" color="bg-purple-100 text-purple-800" />
            </div>
          </div>
        )}

        {activeTab === 'curriculum' && (
          <ul className="space-y-3 animate-fade-in">
            <CurriculumItem title="Module 1: Introduction & Setup" duration="45m" />
            <CurriculumItem title="Module 2: Core Concepts Deep Dive" duration="2h 15m" />
            <CurriculumItem title="Module 3: Advanced Patterns" duration="3h 30m" />
            <CurriculumItem title="Module 4: Final Project Build" duration="5h" />
          </ul>
        )}

        {activeTab === 'outcomes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
            <Outcome text="Build full-stack applications from scratch" />
            <Outcome text="Understand system architecture principles" />
            <Outcome text="Master Git and deployment workflows" />
            <Outcome text="Debug complex applications efficiently" />
          </div>
        )}
      </div>
    </div>
  );
};

const Badge = ({ label, color }) => (
  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${color}`}>{label}</span>
);

const CurriculumItem = ({ title, duration }) => (
  <li className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
    <span className="text-gray-700 font-medium text-sm">{title}</span>
    <span className="text-gray-400 text-xs">{duration}</span>
  </li>
);

const Outcome = ({ text }) => (
  <div className="flex items-start gap-2">
    <span className="text-green-500 mt-1">✓</span>
    <span className="text-gray-600 text-sm">{text}</span>
  </div>
);

export default CourseInfoTabs;