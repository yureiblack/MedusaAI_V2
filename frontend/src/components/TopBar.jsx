import React from 'react';

const TopBar = ({ onLogout, activeTab, searchQuery, onSearchChange, onToggleSidebar }) => {
  const today = new Date().toLocaleDateString('en-US', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  const isDashboard = activeTab === 'dashboard';

  return (
    <header className={`topbar ${isDashboard ? 'scrollable' : 'sticky'}`}>
      <div className="topbar-left">
        <button className="mobile-menu-btn" onClick={onToggleSidebar}>
          <svg width="24" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
        {isDashboard && (
          <div className="search-container">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input 
              type="text" 
              placeholder="Search history..." 
              className="search-input" 
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="topbar-center">
        <div className="date-display">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          <span className="date-text">{today}</span>
        </div>
      </div>

      <div className="topbar-right">
      </div>

      <style jsx>{`
        .topbar {
          height: 80px;
          padding: 0 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: transparent;
          z-index: 90;
        }

        .mobile-menu-btn {
          display: none;
          background: none;
          color: var(--text);
          padding: 8px;
          margin-right: 12px;
          cursor: pointer;
        }

        .topbar.sticky {
          position: sticky;
          top: 0;
        }

        .topbar.scrollable {
          position: relative;
        }

        .topbar-left {
          flex: 1;
          display: flex;
          align-items: center;
        }

        .search-container {
          position: relative;
          max-width: 300px;
          width: 100%;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .search-input {
          width: 100%;
          padding: 10px 12px 10px 40px;
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 12px;
          font-size: 14px;
        }

        .topbar-center {
          flex: 1;
          display: flex;
          justify-content: center;
        }

        .date-display {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
          color: var(--text-muted);
        }

        .topbar-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 20px;
        }

        @media (max-width: 768px) {
          .topbar {
            padding: 0 8px;
            height: 60px;
            gap: 4px;
          }
          .mobile-menu-btn {
            display: flex;
            margin-right: 0;
            padding: 4px;
          }
          .date-text {
            display: inline;
            font-size: 11px;
          }
          .date-display {
            padding: 4px 8px;
            gap: 4px;
          }
          .search-container {
            max-width: 220px;
            flex: 1;
          }
          .search-icon {
            width: 14px;
            height: 14px;
            left: 8px;
          }
          .search-input {
            padding: 6px 8px 6px 28px;
            font-size: 12px;
            height: 32px;
          }
        }
      `}</style>
    </header>
  );
};

export default TopBar;
