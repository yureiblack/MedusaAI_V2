import React, { useState, useEffect } from "react";
import Layout from "./components/Layout";
import Dashboard from "./views/Dashboard";
import ResearchChat from "./views/ResearchChat";
import Auth from "./views/Auth";
import { supabase } from "./supabaseClient";

const INITIAL_MESSAGE = {
  role: 'bot',
  text: "Hello! I'm your AI Research Agent. What complex topic should I investigate for you today?"
};

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sessions, setSessions] = useState([
    {
      id: 'initial',
      title: 'New Research',
      messages: [INITIAL_MESSAGE],
      timestamp: Date.now()
    }
  ]);
  const [activeSessionId, setActiveSessionId] = useState('initial');
  const [searchQuery, setSearchQuery] = useState('');

  // Restore session on page refresh
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setUser({
          name: data.session.user.user_metadata?.full_name || data.session.user.email,
          email: data.session.user.email
        });
        setToken(data.session.access_token);
      }
    });

    // Listen for auth changes (e.g. Google OAuth redirect)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser({
          name: session.user.user_metadata?.full_name || session.user.email,
          email: session.user.email
        });
        setToken(session.access_token);
      } else {
        setUser(null);
        setToken(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0] || { id: 'fallback', messages: [] };

  const fetchHistory = async (authToken) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/history", {
        headers: { "Authorization": `Bearer ${authToken}` }
      });
      const data = await res.json();
      
      const sessionHistory = data.map(row => ({
        id: row.id,
        title: row.query,
        messages: [
          { role: 'user', text: row.query },
          { role: 'bot', text: row.report }
        ],
        timestamp: new Date(row.created_at).getTime()
      }));

      if (sessionHistory.length > 0) {
        setSessions(sessionHistory);
      }
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchHistory(token);
    }
  }, [token]);

  const handleLogin = (userData) => {
    setUser(userData);
    setToken(userData.token);
    if (userData.token) fetchHistory(userData.token);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setToken(null);
  };

  const handleNewSession = () => {
    const newId = Date.now().toString();
    const newSession = {
      id: newId,
      title: 'New Research',
      messages: [INITIAL_MESSAGE],
      timestamp: Date.now()
    };

    setSessions(prev => {
      if (prev.length > 0 && prev[0].title === 'New Research' && prev[0].messages.length === 1) {
        return prev;
      }
      return [newSession, ...prev];
    });

    setActiveSessionId(newId);
    setActiveTab('research');
  };

  const handleSwitchSession = (id) => {
    setActiveSessionId(id);
    setActiveTab('research');
  };

  const handleDeleteSession = (id) => {
    setSessions(prev => {
      const newSessions = prev.filter(s => s.id !== id);

      if (activeSessionId === id) {
        if (newSessions.length > 0) {
          setActiveSessionId(newSessions[0].id);
        } else {
          const newId = Date.now().toString();
          const newS = {
            id: newId,
            title: 'New Research',
            messages: [INITIAL_MESSAGE],
            timestamp: Date.now()
          };
          setActiveSessionId(newId);
          return [newS];
        }
      }
      return newSessions;
    });
  };

  const handleUpdateSession = (sessionId, newMessages) => {
    setSessions(prev => prev.map(s => {
      if (s.id === sessionId) {
        let newTitle = s.title;
        if (s.title === 'New Research') {
          const userMsg = newMessages.find(m => m.role === 'user');
          if (userMsg) {
            newTitle = userMsg.text.slice(0, 30) + (userMsg.text.length > 30 ? '...' : '');
          }
        }
        return { ...s, messages: newMessages, title: newTitle };
      }
      return s;
    }));
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  const renderView = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <Dashboard
            sessions={sessions}
            onSwitchSession={handleSwitchSession}
            onDeleteSession={handleDeleteSession}
            searchQuery={searchQuery}
            user={user}
          />
        );
      case "research":
        return (
          <ResearchChat
            session={activeSession}
            token={token}
            user={user}
            onUpdateMessages={(msgs) => handleUpdateSession(activeSession.id, msgs)}
          />
        );
      default:
        return (
          <Dashboard
            sessions={sessions}
            onSwitchSession={handleSwitchSession}
            onDeleteSession={handleDeleteSession}
            searchQuery={searchQuery}
            user={user}
          />
        );
    }
  };

  return (
    <Layout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onLogout={handleLogout}
      sessions={sessions}
      activeSessionId={activeSessionId}
      onNewSession={handleNewSession}
      onSwitchSession={handleSwitchSession}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      user={user}
    >
      {renderView()}
    </Layout>
  );
}

export default App;