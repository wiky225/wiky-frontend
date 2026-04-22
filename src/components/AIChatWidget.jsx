import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import API_URL from '../lib/api.js';

function getOrCreateSessionId() {
  let id = localStorage.getItem('wikya_chat_session');
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem('wikya_chat_session', id);
  }
  return id;
}

function getWelcomeMessage(user) {
  const role = user?.user_metadata?.role;
  const prenom = user?.user_metadata?.prenom;
  if (role === 'conducteur') return `Bonjour ${prenom || ''} ! Comment puis-je vous aider ? Je peux vous informer sur votre profil, les offres disponibles ou votre abonnement.`;
  if (role === 'recruteur') return `Bonjour ${prenom || ''} ! Je peux vous aider à trouver des conducteurs disponibles ou répondre à vos questions sur la plateforme.`;
  return 'Bonjour ! Je suis l\'assistant Wikya. Comment puis-je vous aider ? (inscription, tarifs, fonctionnement…)';
}

const BUBBLE_KEY = 'wikya_chat_bubble_seen';

export default function AIChatWidget() {
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const sessionId = useRef(getOrCreateSessionId());

  // Bulle de bienvenue — apparaît après 4s, une seule fois par navigateur
  useEffect(() => {
    if (loading) return;
    if (localStorage.getItem(BUBBLE_KEY)) return;
    const t1 = setTimeout(() => setShowBubble(true), 4000);
    const t2 = setTimeout(() => {
      setShowBubble(false);
      localStorage.setItem(BUBBLE_KEY, '1');
    }, 12000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [loading]);

  const handleOpenChat = () => {
    setShowBubble(false);
    localStorage.setItem(BUBBLE_KEY, '1');
    setOpen(o => !o);
  };

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: 'agent', text: getWelcomeMessage(user) }]);
    }
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || thinking) return;

    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setThinking(true);

    try {
      const headers = { 'Content-Type': 'application/json' };
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`;

      const res = await fetch(`${API_URL}/api/agent/chat`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ message: text, sessionId: sessionId.current }),
      });

      const data = await res.json();
      setMessages(prev => [...prev, { role: 'agent', text: data.response || 'Désolé, je n\'ai pas pu répondre.' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'agent', text: 'Désolé, une erreur est survenue. Réessayez dans quelques instants.' }]);
    } finally {
      setThinking(false);
    }
  }, [input, thinking]);

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  if (loading) return null;

  return (
    <>
      {/* Fenêtre de chat */}
      {open && (
        <div className="fixed bottom-28 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-80 max-h-[480px] bg-white rounded-2xl shadow-2xl z-40 flex flex-col overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-wikya-blue px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <img src="/avatar-agent.png" alt="Assistant Wikya" className="w-9 h-9 rounded-full object-cover border-2 border-white/30" />
              <div>
                <p className="text-white font-semibold text-sm leading-none">Assistant Wikya</p>
                <p className="text-white/70 text-xs">Réponse immédiate</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-wikya-orange text-white rounded-br-sm'
                    : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {thinking && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-2 shadow-sm">
                  <div className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}/>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}/>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}/>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-100 bg-white shrink-0 flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Posez votre question…"
              className="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-wikya-blue transition-colors"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || thinking}
              className="w-9 h-9 rounded-xl bg-wikya-orange disabled:opacity-40 flex items-center justify-center transition-opacity shrink-0"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Bulle de bienvenue */}
      {showBubble && !open && (
        <div
          onClick={handleOpenChat}
          className="fixed bottom-[7.5rem] right-4 sm:right-6 z-40 cursor-pointer animate-bounce-soft"
          style={{ animation: 'fadeSlideIn 0.4s ease-out' }}
        >
          <div className="bg-white text-gray-800 text-sm rounded-2xl rounded-br-sm shadow-xl border border-gray-100 px-4 py-3 max-w-[220px] relative">
            👋 Bonjour ! Besoin d'aide pour vous inscrire ?
            <button
              onClick={e => { e.stopPropagation(); setShowBubble(false); localStorage.setItem(BUBBLE_KEY, '1'); }}
              className="absolute -top-2 -right-2 w-5 h-5 bg-gray-300 hover:bg-gray-400 rounded-full text-white text-xs flex items-center justify-center"
            >×</button>
          </div>
          <div className="w-3 h-3 bg-white border-r border-b border-gray-100 absolute -bottom-1.5 right-5 rotate-45"/>
        </div>
      )}

      {/* Bouton flottant avec pulse */}
      <div className="fixed bottom-24 right-4 sm:right-6 z-40">
        {!open && (
          <span className="absolute inset-0 rounded-full bg-wikya-orange opacity-40 animate-ping"/>
        )}
        <button
          onClick={handleOpenChat}
          aria-label="Assistant Wikya"
          className="relative w-[52px] h-[52px] rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center overflow-hidden bg-wikya-blue"
        >
          {open ? (
            <div className="w-full h-full bg-wikya-blue flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </div>
          ) : (
            <img src="/avatar-agent.png" alt="Assistant Wikya" className="w-full h-full object-cover" />
          )}
        </button>
      </div>
    </>
  );
}
