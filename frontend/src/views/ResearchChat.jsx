import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const Message = ({ chat, user }) => {
  const isBot = chat.role === 'bot';
  const userName = user?.name || "User";
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=aa3bff&color=fff`;

  return (
    <div className={`message-wrapper ${isBot ? 'bot' : 'user'}`}>
      <div className="message-avatar">
        {isBot ? (
          <div className="bot-avatar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10H12V2z"></path><path d="M12 2a10 10 0 0 1 10 10h-10V2z"></path></svg>
          </div>
        ) : (
          <img src={avatarUrl} alt="User" />
        )}
      </div>
      <div className="message-content glass">
        <div className="message-text">
          {isBot ? (
            <ReactMarkdown>{chat.text}</ReactMarkdown>
          ) : (
            chat.text
          )}
        </div>
        {chat.sources && chat.sources.length > 0 && (
          <div className="message-sources">
            <p className="sources-title">Sources Found:</p>
            <div className="sources-list">
              {chat.sources.map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className="source-link">
                  {new URL(s.href).hostname}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// token is the only new prop added
const ResearchChat = ({ session, token, user, onUpdateMessages }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [session.messages]);

  const handleSend = async () => {
    if (!query.trim()) return;
    if (!token) {
      alert("You must be logged in to performing research.");
      return;
    }

    const userMsg = { role: 'user', text: query };
    const newMessages = [...session.messages, userMsg];
    onUpdateMessages(newMessages);
    setQuery("");
    setLoading(true);

    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
      const res = await axios.post(
        `${apiBase}/research`,
        { query },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const botMsg = {
        role: 'bot',
        text: res.data.final_report,
        sources: res.data.filtered_results
      };

      onUpdateMessages([...newMessages, botMsg]);
    } catch (err) {
      const errorText = err.response?.status === 401
        ? "Session expired. Please log in again."
        : "Sorry, I encountered an error while researching. Please try again.";
      onUpdateMessages([...newMessages, { role: 'bot', text: errorText }]);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    const lastBotMessage = [...session.messages].reverse().find(m => m.role === 'bot');
    if (!lastBotMessage) return;

    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
      const endpoint = format === 'pdf' ? '/export/pdf' : '/export/md';
      const response = await axios.post(
        `${apiBase}${endpoint}`,
        { text: lastBotMessage.text },
        { 
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob' 
        }
      );

      // Specify correct MIME type e.g. application/pdf or text/markdown
      const mimeType = format === 'pdf' ? 'application/pdf' : 'text/markdown';
      const blob = new Blob([response.data], { type: mimeType });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `research_report.${format}`);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      link.remove();
      setShowExportOptions(false);
    } catch (err) {
      console.error("Export failed:", err);
      alert("Failed to export report. Please try again.");
    }
  };

  return (
    <div className="research-view">
      <div className="chat-container glass">
        <div className="chat-header">
          <div className="agent-status">
            <div className="status-dot"></div>
            <span>Agent Medusa Core</span>
          </div>
          <div className="chat-actions">
            <div className="export-container">
              <button 
                className="chat-action-btn"
                onClick={() => setShowExportOptions(!showExportOptions)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Export
              </button>
              
              {showExportOptions && (
                <div className="export-dropdown glass">
                  <button onClick={() => handleExport('pdf')}>PDF Document</button>
                  <button onClick={() => handleExport('md')}>Markdown File</button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="chat-messages">
          {session.messages.map((m, i) => (
            <Message key={i} chat={m} user={user} />
          ))}
          {loading && (
            <div className="message-wrapper bot">
              <div className="message-avatar">
                <div className="bot-avatar loading">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"></path></svg>
                </div>
              </div>
              <div className="message-content glass">
                <div className="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
                <p className="loading-text">Agent is searching the web and synthesizing findings...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-area">
          <div className="input-wrapper glass">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask me to research anything..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <button className="send-btn" onClick={handleSend} disabled={loading}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </div>
          <p className="input-hint">Press Enter to send, Shift + Enter for new line</p>
        </div>
      </div>

      {/* All your existing styles unchanged */}
      <style jsx>{`
        .research-view { height: 100%; display: flex; flex-direction: column; max-width: 1000px; margin: 0 auto; }
        .chat-container { flex: 1; display: flex; flex-direction: column; border-radius: var(--radius-xl); border: 1px solid var(--border); overflow: hidden; background: rgba(255, 255, 255, 0.4); }
        .chat-header { padding: 16px 24px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; background: rgba(255, 255, 255, 0.8); }
        .agent-status { display: flex; align-items: center; gap: 10px; font-weight: 600; font-size: 14px; }
        .status-dot { width: 10px; height: 10px; background: #10B981; border-radius: 50%; box-shadow: 0 0 8px #10b98188; }
        .chat-action-btn { background: var(--white); border: 1px solid var(--border); padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 500; display: flex; align-items: center; gap: 6px; }
        .chat-action-btn:hover { background: var(--bg); }
        .export-container { position: relative; }
        .export-dropdown { position: absolute; top: 100%; right: 0; margin-top: 8px; background: white; border: 1px solid var(--border); border-radius: 12px; padding: 8px; display: flex; flex-direction: column; gap: 4px; min-width: 150px; z-index: 100; box-shadow: var(--shadow-md); }
        .export-dropdown button { background: none; border: none; padding: 10px 16px; border-radius: 8px; font-size: 13px; text-align: left; cursor: pointer; transition: all 0.2s; }
        .export-dropdown button:hover { background: var(--bg); color: var(--primary); }
        
        /* Markdown Styling */
        .message-text h1, .message-text h2, .message-text h3 { margin-top: 16px; margin-bottom: 8px; color: var(--text-dark); }
        .message-text h1 { font-size: 1.4rem; }
        .message-text h2 { font-size: 1.2rem; }
        .message-text p { margin-bottom: 12px; }
        .message-text ul, .message-text ol { margin-left: 20px; margin-bottom: 12px; }
        .message-text li { margin-bottom: 4px; }
        .message-text strong { color: var(--primary); }

        .chat-messages { flex: 1; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 24px; }
        .message-wrapper { display: flex; gap: 16px; max-width: 85%; }
        .message-wrapper.user { flex-direction: row-reverse; align-self: flex-end; }
        .message-avatar img, .bot-avatar { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; }
        .bot-avatar { background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; }
        .bot-avatar.loading svg { animation: spin 2s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .message-content { padding: 16px 20px; border-radius: 20px; font-size: 15px; line-height: 1.6; white-space: pre-wrap; }
        .message-wrapper.user .message-content { background: var(--primary); color: white; border-bottom-right-radius: 4px; }
        .message-wrapper.bot .message-content { background: white; border-bottom-left-radius: 4px; border: 1px solid var(--border); }
        .message-sources { margin-top: 16px; padding-top: 12px; border-top: 1px solid var(--border); }
        .sources-title { font-size: 12px; font-weight: 600; color: var(--text-muted); margin-bottom: 8px; }
        .sources-list { display: flex; flex-wrap: wrap; gap: 8px; }
        .source-link { font-size: 11px; padding: 4px 8px; background: var(--bg); border: 1px solid var(--border); border-radius: 4px; color: var(--primary); text-decoration: none; }
        .typing-indicator { display: flex; gap: 4px; margin-bottom: 8px; }
        .typing-indicator span { width: 6px; height: 6px; background: var(--text-muted); border-radius: 50%; animation: bounce 1.4s infinite ease-in-out both; }
        .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
        .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
        @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1.0); } }
        .loading-text { font-size: 13px; color: var(--text-muted); font-style: italic; }
        .chat-input-area { padding: 24px; background: rgba(255, 255, 255, 0.6); }
        .input-wrapper { display: flex; align-items: flex-end; gap: 12px; background: white; border: 1px solid var(--border); border-radius: 16px; padding: 12px 16px; box-shadow: var(--shadow-sm); }
        textarea { flex: 1; background: none; border: none; resize: none; padding: 8px 0; height: 40px; max-height: 150px; font-size: 15px; }
        .send-btn { width: 40px; height: 40px; border-radius: 10px; background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; }
        .send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .input-hint { font-size: 11px; color: var(--text-muted); margin-top: 8px; text-align: center; }

        @media (max-width: 768px) {
          .chat-header { padding: 12px 16px; }
          .agent-status span { display: none; }
          .message-wrapper { max-width: 92%; gap: 12px; }
          .message-content { padding: 12px 16px; font-size: 14px; }
          .chat-input-area { padding: 16px; }
          .input-wrapper { padding: 10px 12px; }
          textarea { font-size: 14px; }
          .message-avatar img, .bot-avatar { width: 32px; height: 32px; }
        }
      `}</style>
    </div>
  );
};

export default ResearchChat;