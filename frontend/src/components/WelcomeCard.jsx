import React from 'react';
import heroImage from '../assets/hero-agent.png';

const WelcomeCard = ({ userName = "Sophia" }) => {
  return (
    <div className="welcome-card glass">
      <div className="welcome-content">
        <h1 className="welcome-title">Hi, {userName}!</h1>
        <p className="welcome-subtitle">What are we researching today?</p>
        
        <div className="quick-actions">
          <button className="action-link">
            <span className="action-bullet blue"></span>
            Check Tasks
          </button>
          <button className="action-link">
            <span className="action-bullet yellow"></span>
            Manage Projects
          </button>
          <button className="action-link">
            <span className="action-bullet red"></span>
            Agent Logs
          </button>
          <button className="action-link">
            <span className="action-bullet green"></span>
            Export Reports
          </button>
        </div>
      </div>
      
      <div className="welcome-image">
        <img src={heroImage} alt="AI Hero" />
      </div>

      <style jsx>{`
        .welcome-card {
          border-radius: var(--radius-xl);
          padding: 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          position: relative;
          overflow: hidden;
          box-shadow: var(--shadow-soft);
        }

        .welcome-content {
          flex: 1;
          z-index: 1;
        }

        .welcome-title {
          font-size: 48px;
          font-weight: 700;
          margin-bottom: 8px;
          color: var(--text);
        }

        .welcome-subtitle {
          font-size: 18px;
          color: var(--text-muted);
          margin-bottom: 32px;
        }

        .quick-actions {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          max-width: 400px;
        }

        .action-link {
          display: flex;
          align-items: center;
          gap: 10px;
          background: none;
          font-size: 14px;
          font-weight: 500;
          color: var(--text);
          padding: 8px 12px;
          border-radius: 12px;
          transition: background 0.2s;
        }

        .action-link:hover {
          background: rgba(0, 0, 0, 0.05);
        }

        .action-bullet {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }
        
        .action-bullet.blue { background: #3b82f6; border: 2px solid #3b82f644; }
        .action-bullet.yellow { background: #fbbf24; border: 2px solid #fbbf2444; }
        .action-bullet.red { background: #ef4444; border: 2px solid #ef444444; }
        .action-bullet.green { background: #10b981; border: 2px solid #10b98144; }

        .welcome-image {
          height: 220px;
          width: 220px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .welcome-image img {
          max-height: 100%;
          filter: drop-shadow(0 10px 20px rgba(0,0,0,0.1));
        }

        @media (max-width: 1024px) {
          .welcome-title { font-size: 36px; }
          .welcome-image { height: 180px; width: 180px; }
        }

        @media (max-width: 768px) {
          .welcome-card {
            flex-direction: column-reverse;
            padding: 20px;
            text-align: center;
            align-items: center;
          }
          .welcome-title { font-size: 28px; }
          .welcome-subtitle { font-size: 16px; margin-bottom: 24px; }
          .welcome-image { height: 140px; width: 140px; margin-bottom: 20px; }
          .quick-actions { 
            grid-template-columns: 1fr; 
            width: 100%;
          }
          .action-link { justify-content: center; }
        }
      `}</style>
    </div>
  );
};

export default WelcomeCard;
