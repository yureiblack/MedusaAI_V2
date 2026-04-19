import React from 'react';
import WelcomeCard from '../components/WelcomeCard';

const Dashboard = ({ sessions = [], onSwitchSession, onDeleteSession, searchQuery = '', user }) => {
  const filteredSessions = sessions.filter(session => 
    session.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dashboard-view">
      <div className="dashboard-main">
        <h2 className="section-title">Dashboard</h2>
        <WelcomeCard userName={user?.name} />
        
        <div className="dashboard-history">
          <h3 className="history-section-title">Recent Research</h3>
          <div className="history-grid">
            {filteredSessions.length > 0 ? (
              filteredSessions.map((session) => (
                <div 
                  key={session.id} 
                  className="history-card"
                  onClick={() => onSwitchSession(session.id)}
                >
                  <div className="history-card-header">
                    <div className="history-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.38 8.38 0 0 1 3.8.9"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    </div>
                    <div className="header-right">
                      <span className="history-date">
                        {new Date(session.timestamp).toLocaleDateString()}
                      </span>
                      <button 
                        className="delete-btn" 
                        onClick={(e) => { e.stopPropagation(); onDeleteSession(session.id); }}
                        title="Delete Chat"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                      </button>
                    </div>
                  </div>
                  <h4 className="card-session-title">{session.title}</h4>
                  <div className="history-card-footer">
                    <span className="msg-count">{session.messages.length} messages</span>
                    <div className="view-link">
                      View
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results glass">
                <p>No research sessions match your search.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-view {
          display: block;
          max-width: 1200px;
          margin: 0 auto;
          height: 100%;
          padding-bottom: 40px;
        }

        .section-title {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 24px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .history-section-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 20px;
          color: var(--text);
        }

        .history-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }

        .history-card {
          padding: 20px;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border);
          transition: all 0.3s ease;
          cursor: pointer;
          background: white;
          box-shadow: var(--shadow-sm);
        }

        .history-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
          border-color: var(--primary);
        }

        .history-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .delete-btn {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          color: var(--text-muted);
          transition: all 0.2s;
          border: none;
          cursor: pointer;
        }

        .delete-btn:hover {
          background: #fee2e2;
          color: #ef4444;
        }

        .history-icon {
          width: 36px;
          height: 36px;
          background: var(--primary-light);
          color: var(--primary);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .history-date {
          font-size: 12px;
          color: var(--text-muted);
        }

        .card-session-title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 16px;
          line-height: 1.4;
          height: 44px;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .history-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 12px;
          border-top: 1px solid var(--border);
        }

        .msg-count {
          font-size: 12px;
          color: var(--text-muted);
        }

        .view-link {
          font-size: 13px;
          font-weight: 500;
          color: var(--primary);
          display: flex;
          align-items: center;
          gap: 4px;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
