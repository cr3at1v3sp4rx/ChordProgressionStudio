import React, { useState } from 'react';

const Tabs = ({ children, defaultValue }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <div className="tabs">
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { activeTab, setActiveTab })
      )}
    </div>
  );
};

const TabsList = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="flex border-b border-gray-200">
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { activeTab, setActiveTab })
      )}
    </div>
  );
};

const TabsTrigger = ({ children, value, activeTab, setActiveTab }) => {
  return (
    <button
      className={`px-4 py-2 font-medium text-sm focus:outline-none ${
        activeTab === value
          ? 'text-blue-600 border-b-2 border-blue-600'
          : 'text-gray-500 hover:text-gray-700'
      }`}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ children, value, activeTab }) => {
  if (value !== activeTab) return null;
  return <div className="py-4">{children}</div>;
};

export { Tabs, TabsContent, TabsList, TabsTrigger };