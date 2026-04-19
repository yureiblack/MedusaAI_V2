import React from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const Layout = ({ 
  children, 
  activeTab, 
  onTabChange, 
  onLogout, 
  sessions, 
  activeSessionId, 
  onNewSession, 
  onSwitchSession,
  searchQuery,
  onSearchChange,
  user
}) => {
  const [isExpanded, setIsExpanded] = React.useState(true);

  return (
    <div className="app-container">
      <Sidebar 
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
        activeTab={activeTab} 
        onTabChange={onTabChange} 
        sessions={sessions}
        activeSessionId={activeSessionId}
        onNewSession={onNewSession}
        onSwitchSession={onSwitchSession}
        onLogout={onLogout}
        user={user}
      />
      
      <main className={`main-content ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <TopBar 
          onLogout={onLogout} 
          activeTab={activeTab} 
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          user={user}
        />
        <div className="view-container animate-fade-in">
          {children}
        </div>
      </main>

      <style jsx>{`
        .app-container {
          display: flex;
          min-height: 100vh;
          background-color: var(--bg);
        }

        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          transition: margin-left 0.3s ease;
        }

        .main-content.expanded {
          margin-left: 260px;
        }

        .main-content.collapsed {
          margin-left: 80px;
        }

        .view-container {
          flex: 1;
          padding: 0 40px 40px 40px;
          height: calc(100vh - 80px); /* Subtract TopBar height */
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
};

export default Layout;
