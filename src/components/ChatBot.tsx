import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api, streamChatResponse } from '../lib/api';
import { ChatSession, ChatMessage } from '../types';
import { MarkdownView } from './MarkdownView';
import {
  Sparkles,
  X,
  Send,
  Square,
  Plus,
  History,
  Trash2,
  Edit2,
  Bot,
  User,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

interface ChatBotProps {
  embedded?: boolean;
  courseId?: string;
  lessonId?: string;
  lessonTitle?: string;
}

const SUGGESTED_CHIPS = [
  'Explain this lesson step-by-step',
  'Give me a 3-question quiz on this topic',
  'Summarize in 5 bullet points',
  'Give a real-world production example',
  'What are the prerequisites?'
];

export const ChatBot: React.FC<ChatBotProps> = ({
  embedded = false,
  courseId: propCourseId,
  lessonId: propLessonId,
  lessonTitle: propLessonTitle
}) => {
  const { user } = useAuth();

  const [isOpen, setIsOpen] = useState(embedded);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedContent, setStreamedContent] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitleInput, setEditTitleInput] = useState('');

  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom of conversation
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamedContent, isStreaming]);

  // Load chat sessions when user is authenticated (auto-select latest only on first load)
  useEffect(() => {
    if (!user) return;
    loadSessions(true);
  }, [user]);

  // autoSelect=true only on first load; later refreshes must not overwrite current messages
  const loadSessions = async (autoSelect = false) => {
    try {
      const data = await api.getChatSessions();
      const list = Array.isArray(data) ? data : [];
      setSessions(list);
      if (autoSelect && list.length > 0) {
        selectSession(list[0].id);
      }
    } catch (err) {
      console.error('Failed to load chat sessions:', err);
    }
  };

  const selectSession = async (sessionId: string) => {
    try {
      setCurrentSessionId(sessionId);
      setShowHistory(false);
      setErrorMessage(null);
      const msgs = await api.getSessionMessages(sessionId);
      setMessages(Array.isArray(msgs) ? msgs : []);
    } catch (err) {
      console.error('Failed to load session messages:', err);
      setMessages([]);
    }
  };

  const handleNewChat = () => {
    setCurrentSessionId(null);
    setMessages([]);
    setStreamedContent('');
    setErrorMessage(null);
    setShowHistory(false);
  };

  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.deleteChatSession(sessionId);
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      if (currentSessionId === sessionId) {
        handleNewChat();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to delete session');
    }
  };

  const handleStartRename = (session: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSessionId(session.id);
    setEditTitleInput(session.title);
  };

  const handleSaveRename = async (sessionId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitleInput.trim()) return;
    try {
      const updated = await api.renameChatSession(sessionId, editTitleInput.trim());
      setSessions(prev => prev.map(s => (s.id === sessionId ? updated : s)));
      setEditingSessionId(null);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to rename session');
    }
  };

  const handleStopGenerating = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isStreaming) return;

    setInputText('');
    setErrorMessage(null);

    // Previous conversation (sent to the server so the AI remembers context)
    const history = messages.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content
    }));

    // Optimistically append user message
    const tempUserMsg: ChatMessage = {
      id: `usr-msg-${Date.now()}`,
      sessionId: currentSessionId || '',
      role: 'user',
      content: text,
      createdAt: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempUserMsg]);
    setIsStreaming(true);
    setStreamedContent('');

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    let activeSessionId = currentSessionId;

    try {
      await streamChatResponse({
        sessionId: activeSessionId || undefined,
        message: text,
        history,
        courseId: propCourseId,
        lessonId: propLessonId,
        signal: abortController.signal,
        onSessionCreated: (newId) => {
          activeSessionId = newId;
          setCurrentSessionId(newId);
          loadSessions();
        },
        onChunk: (chunk) => {
          setStreamedContent(prev => prev + chunk);
        },
        onComplete: (fullContent) => {
          setIsStreaming(false);
          const assistantMsg: ChatMessage = {
            id: `asst-msg-${Date.now()}`,
            sessionId: activeSessionId || '',
            role: 'assistant',
            content: fullContent,
            createdAt: new Date().toISOString()
          };
          setMessages(prev => [...prev, assistantMsg]);
          setStreamedContent('');
          loadSessions();
        },
        onError: (err) => {
          setIsStreaming(false);
          setStreamedContent('');
          setErrorMessage(err.message || 'Failed to complete AI response');
        }
      });
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setErrorMessage(err.message || 'Failed to connect to LearnHub AI');
      }
      setIsStreaming(false);
    }
  };

  // If not logged in, don't show floating button
  if (!user && !embedded) {
    return null;
  }

  // Active session title
  const currentSession = sessions.find(s => s.id === currentSessionId);

  // Render embedded mode inside Lesson Player tab
  if (embedded) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-[520px] overflow-hidden shadow-xl">
        {/* Header */}
        <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Ask LearnHub AI</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 font-semibold rounded-full">
                  Online Tutor
                </span>
              </h3>
              <p className="text-[10px] text-slate-400 truncate max-w-xs">
                {propLessonTitle ? `Context: ${propLessonTitle}` : 'Interactive AI Assistant'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleNewChat}
              className="px-2.5 py-1 text-[11px] font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>New Chat</span>
            </button>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Chat History"
            >
              <History className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content body */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* History Sidebar */}
          {showHistory && (
            <div className="w-60 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0 z-10">
              <div className="p-3 border-b border-slate-800 flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Past Sessions</span>
                <button onClick={() => setShowHistory(false)} className="p-1 text-slate-500 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {sessions.length === 0 ? (
                  <p className="text-[11px] text-slate-500 text-center py-6">No previous chats</p>
                ) : (
                  sessions.map(s => (
                    <div
                      key={s.id}
                      onClick={() => selectSession(s.id)}
                      className={`group flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                        currentSessionId === s.id
                          ? 'bg-indigo-600/30 text-indigo-300 font-semibold'
                          : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                      }`}
                    >
                      <span className="truncate text-[11px]">{s.title}</span>
                      <button
                        onClick={(e) => handleDeleteSession(s.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                        title="Delete chat"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Main Messages Area */}
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-950/60">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && !isStreaming ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">How can I help you learn today?</h4>
                    <p className="text-[11px] text-slate-400 max-w-sm mt-1">
                      I have full context of this course and module. Ask for a breakdown, code examples, quizzes, or step-by-step explanations.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 justify-center max-w-md pt-2">
                    {SUGGESTED_CHIPS.map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(chip)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 hover:text-white transition-colors text-left"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center justify-center text-white shrink-0 mt-0.5">
                          <Bot className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <div
                        className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-tr-xs'
                            : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-xs shadow-xs'
                        }`}
                      >
                        {msg.role === 'user' ? (
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        ) : (
                          <MarkdownView content={msg.content} />
                        )}
                      </div>
                      {msg.role === 'user' && (
                        <div className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                          <User className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Streaming live chunk */}
                  {isStreaming && (
                    <div className="flex gap-2.5 justify-start">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center justify-center text-white shrink-0 mt-0.5 animate-pulse">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                      <div className="max-w-[85%] bg-slate-900 border border-slate-800 text-slate-200 rounded-2xl rounded-tl-xs p-3 shadow-xs text-xs">
                        {streamedContent ? (
                          <MarkdownView content={streamedContent} />
                        ) : (
                          <div className="flex items-center gap-1.5 text-slate-400 py-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                            <span className="text-[11px]">LearnHub AI is thinking...</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Error banner */}
            {errorMessage && (
              <div className="px-4 py-2 bg-rose-950/60 border-t border-rose-900/60 text-rose-300 text-[11px] flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errorMessage}</span>
                </span>
                <button onClick={() => setErrorMessage(null)} className="text-rose-400 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Input Bar */}
            <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={isStreaming ? 'Streaming answer...' : 'Ask a question about this lesson...'}
                disabled={isStreaming}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />

              {isStreaming ? (
                <button
                  onClick={handleStopGenerating}
                  className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                  title="Stop generating"
                >
                  <Square className="w-3 h-3 fill-white" />
                  <span>Stop</span>
                </button>
              ) : (
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim()}
                  className="p-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:opacity-40 text-white rounded-xl transition-all shadow-xs"
                >
                  <Send className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // FLOATING GLOBAL MODE (Available bottom-right on all pages for authenticated users)
  return (
    <>
      {/* Floating Sparkle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-xl shadow-indigo-600/30 flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 group"
          aria-label="Ask LearnHub AI"
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
          </div>
          <span className="text-xs font-bold tracking-wide">Ask LearnHub AI</span>
        </button>
      )}

      {/* Floating Card (400x600 on desktop, full-screen drawer on mobile) */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[420px] sm:h-[620px] z-50 flex flex-col bg-white dark:bg-slate-900 sm:rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">

          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white flex items-center justify-between shrink-0 shadow-xs">
            <div className="flex items-center gap-2 truncate">
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <div className="truncate">
                <h3 className="text-xs font-bold leading-tight flex items-center gap-1.5">
                  <span>LearnHub AI Tutor</span>
                </h3>
                <p className="text-[10px] text-indigo-100 truncate">
                  {currentSession?.title || 'Live Coding & Concept Tutor'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={handleNewChat}
                className="p-1.5 hover:bg-white/20 rounded-lg text-white transition-colors"
                title="New Chat"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className={`p-1.5 rounded-lg transition-colors ${showHistory ? 'bg-white/30 text-white' : 'hover:bg-white/20 text-white'}`}
                title="Chat History"
              >
                <History className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-lg text-white transition-colors"
                title="Close Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* History Drawer Overlay */}
          {showHistory && (
            <div className="absolute inset-0 top-14 bg-white dark:bg-slate-900 z-20 flex flex-col p-4 animate-in slide-in-from-right duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Chat History
                </span>
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold"
                >
                  Done
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                {sessions.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-10">No saved sessions yet</p>
                ) : (
                  sessions.map(s => (
                    <div
                      key={s.id}
                      onClick={() => selectSession(s.id)}
                      className={`group flex items-center justify-between p-2.5 rounded-xl text-xs cursor-pointer transition-colors ${
                        currentSessionId === s.id
                          ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {editingSessionId === s.id ? (
                        <form onSubmit={(e) => handleSaveRename(s.id, e)} className="flex-1 flex gap-1 mr-2" onClick={e => e.stopPropagation()}>
                          <input
                            type="text"
                            value={editTitleInput}
                            onChange={e => setEditTitleInput(e.target.value)}
                            className="flex-1 bg-white dark:bg-slate-950 border border-indigo-500 rounded px-1.5 py-0.5 text-xs text-slate-900 dark:text-white"
                            autoFocus
                          />
                          <button type="submit" className="text-[10px] bg-indigo-600 text-white px-2 rounded">
                            Save
                          </button>
                        </form>
                      ) : (
                        <div className="truncate flex-1 pr-2">
                          <p className="truncate text-xs">{s.title}</p>
                          <span className="text-[10px] text-slate-400">{new Date(s.createdAt).toLocaleDateString()}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => handleStartRename(s, e)}
                          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                          title="Rename"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteSession(s.id, e)}
                          className="p-1 text-slate-400 hover:text-rose-600"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-950/40">
            {messages.length === 0 && !isStreaming ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                  <Sparkles className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Ask LearnHub AI
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mt-1">
                    Your personal learning assistant. Ask questions about courses, coding concepts, study plans, or quizzes.
                  </p>
                </div>
                <div className="flex flex-col gap-1.5 w-full max-w-xs pt-2">
                  {SUGGESTED_CHIPS.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(chip)}
                      className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700/80 text-xs text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left flex items-center justify-between shadow-xs"
                    >
                      <span className="truncate">{chip}</span>
                      <ArrowRight className="w-3 h-3 shrink-0 ml-1 opacity-50" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center justify-center text-white shrink-0 mt-0.5">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-tr-xs shadow-xs'
                          : 'bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 text-slate-900 dark:text-slate-200 rounded-tl-xs shadow-xs'
                      }`}
                    >
                      {msg.role === 'user' ? (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      ) : (
                        <MarkdownView content={msg.content} />
                      )}
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 shrink-0 mt-0.5">
                        <User className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                ))}

                {/* Live stream */}
                {isStreaming && (
                  <div className="flex gap-2.5 justify-start">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center justify-center text-white shrink-0 mt-0.5 animate-pulse">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <div className="max-w-[85%] bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 text-slate-900 dark:text-slate-200 rounded-2xl rounded-tl-xs p-3 shadow-xs text-xs">
                      {streamedContent ? (
                        <MarkdownView content={streamedContent} />
                      ) : (
                        <div className="flex items-center gap-1.5 text-slate-400 py-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                          <span className="text-[11px]">LearnHub AI is thinking...</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="px-4 py-2.5 bg-rose-50 dark:bg-rose-950/70 border-t border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </span>
              <button onClick={() => setErrorMessage(null)} className="text-rose-500 hover:text-rose-700">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Input Bar */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={isStreaming ? 'Generating response...' : 'Type a question...'}
              disabled={isStreaming}
              className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />

            {isStreaming ? (
              <button
                onClick={handleStopGenerating}
                className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors shrink-0"
              >
                <Square className="w-3 h-3 fill-white" />
                <span>Stop</span>
              </button>
            ) : (
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim()}
                className="p-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:opacity-40 text-white rounded-xl transition-all shadow-xs shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      )}
    </>
  );
};