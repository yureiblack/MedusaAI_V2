import React from 'react';

const Sidebar = ({
  isExpanded,
  onToggle,
  activeTab,
  onTabChange,
  sessions = [],
  activeSessionId,
  onNewSession,
  onSwitchSession,
  onLogout,
  user
}) => {
  const userName = user?.name || "User";
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=aa3bff&color=fff`;

  return (
    <aside className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="sidebar-header">
        <button className="toggle-btn" onClick={onToggle} title={isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
        {isExpanded && (
          <button className="new-chat-btn" onClick={onNewSession}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            <span>New Research</span>
          </button>
        )}
        {!isExpanded && (
          <button className="new-chat-btn-mini" onClick={onNewSession} title="New Research">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
        )}
      </div>

      <div className="sidebar-nav">
        <button
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => onTabChange('dashboard')}
          title={!isExpanded ? "Dashboard" : ""}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          {isExpanded && <span>Dashboard</span>}
        </button>
        <button
          className={`nav-item ${activeTab === 'research' ? 'active' : ''}`}
          onClick={() => onTabChange('research')}
          title={!isExpanded ? "Research" : ""}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          {isExpanded && <span>Research</span>}
        </button>
      </div>

      <div className="sidebar-footer">
        <div className="user-profile-card" onClick={onLogout}>
          <img src={avatarUrl} alt="User" className="avatar" />
          {isExpanded && (
            <div className="user-info">
              <span className="user-name">{userName}</span>
              <span className="user-role">Researcher</span>
            </div>
          )}
          {isExpanded && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>}
        </div>
      </div>

      <style jsx>{`
        .sidebar {
          height: 100vh;
          background: #171923;
          color: white;
          display: flex;
          flex-direction: column;
          padding: 12px;
          position: fixed;
          left: 0;
          top: 0;
          z-index: 1000;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }

        .sidebar.expanded {
          width: 260px;
        }

        .sidebar.collapsed {
          width: 80px;
          align-items: center;
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 280px !important;
            transform: translateX(-100%);
            box-shadow: 20px 0 50px rgba(0,0,0,0.5);
          }
          
          .sidebar.expanded {
            transform: translateX(0);
          }

          .sidebar.collapsed {
            transform: translateX(-100%);
          }
        }

        .sidebar-header {
          margin-bottom: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: 100%;
        }

        .toggle-btn {
          background: transparent;
          color: rgba(255, 255, 255, 0.6);
          padding: 8px;
          border-radius: 8px;
          width: fit-content;
          transition: all 0.2s;
        }

        .toggle-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .new-chat-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: var(--radius);
          background: transparent;
          color: white;
          font-size: 14px;
          font-weight: 500;
          transition: background 0.2s;
          white-space: nowrap;
        }

        .new-chat-btn-mini {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          background: transparent;
          color: white;
          transition: background 0.2s;
        }

        .new-chat-btn:hover, .new-chat-btn-mini:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
          width: 100%;
        }

        .nav-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: var(--radius);
          background: transparent;
          color: rgba(255, 255, 255, 0.8);
          font-size: 14px;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .sidebar.collapsed .nav-item {
          justify-content: center;
          padding: 12px 0;
          width: 48px;
          margin: 0 auto;
        }

        .nav-item:hover, .nav-item.active {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .sidebar-footer {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 12px;
          margin-top: auto;
          width: 100%;
        }

        .user-profile-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: var(--radius);
          cursor: pointer;
          transition: background 0.2s;
        }

        .sidebar.collapsed .user-profile-card {
          justify-content: center;
          padding: 12px 0;
        }

        .user-profile-card:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .avatar {
          width: 32px;
          height: 32px;
          border-radius: 4px;
        }

        .user-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .user-name {
          font-size: 14px;
          font-weight: 600;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .user-role {
          font-size: 11px;
          opacity: 0.6;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
