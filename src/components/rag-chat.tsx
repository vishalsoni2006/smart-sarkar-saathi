'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, Citation, Scheme, UserProfile } from '@/types';
import { executeGroundedRAGChat } from '@/lib/llm/client';
import { useLanguage } from '@/components/language-provider';
import { Send, Bot, User, Sparkles, BookOpen, ExternalLink, Globe, Check, AlertCircle } from 'lucide-react';

interface RAGChatProps {
  scheme: Scheme;
  profile: UserProfile | null;
  targetMissingField?: string | null;
  targetMissingQuestion?: string | null;
  onProfileUpdated?: (updatedField: string, value: any) => void;
}

export function RAGChat({
  scheme,
  profile,
  targetMissingField,
  targetMissingQuestion,
  onProfileUpdated
}: RAGChatProps) {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize initial welcome message or targeted follow-up question
  useEffect(() => {
    const initialMsgs: ChatMessage[] = [];

    if (targetMissingQuestion && targetMissingField) {
      initialMsgs.push({
        id: 'msg-init-followup',
        role: 'assistant',
        content: `Namaste! ${targetMissingQuestion}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggested_prompts: [
          'I own 2.5 acres of agricultural land',
          'Yes, I have an active bank account',
          'What documents do I need to apply?'
        ],
        is_verdict_followup: true
      });
    } else {
      const citizenGreeting = profile?.name
        ? `Namaste ${profile.name}! I am your AI Scheme Guide for ${scheme.short_name}. As a registered ${profile.occupation} from ${profile.state}, I am here to help verify your criteria and answer any questions.`
        : `Namaste! I am your AI Scheme Guide for ${scheme.short_name}. You can ask any question in English, Hindi, Marathi, Bengali, Tamil, Telugu, etc. Every answer is grounded in official Ministry guidelines.`;

      initialMsgs.push({
        id: 'msg-init-welcome',
        role: 'assistant',
        content: citizenGreeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggested_prompts: [
          `What documents do I need for ${scheme.short_name}?`,
          `How do I apply on the official portal?`,
          `What are the financial benefit amounts?`
        ]
      });
    }

    setMessages(initialMsgs);
  }, [scheme.id, targetMissingField, targetMissingQuestion, profile?.name, profile?.occupation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await executeGroundedRAGChat({
        userMessage: query,
        scheme,
        profile,
        targetMissingField
      });

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: response.answer,
        detected_language: response.detectedLanguage,
        citations: response.citations,
        suggested_prompts: response.suggestedPrompts,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        field_updated: response.fieldUpdated?.field
      };

      setMessages((prev) => [...prev, botMsg]);

      // If user provided the missing field, trigger live update to flip verdict!
      if (response.fieldUpdated && onProfileUpdated) {
        onProfileUpdated(response.fieldUpdated.field, response.fieldUpdated.value);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          role: 'assistant',
          content: `I am currently consulting the official guidelines for ${scheme.short_name}. Please check the official portal at ${scheme.official_apply_url} or ask again in a moment.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-blue-900/40 bg-white dark:bg-[#0D1E38] shadow-lg overflow-hidden flex flex-col h-[580px]">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-200 dark:border-blue-900/30 bg-blue-50/40 dark:bg-[#071324] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-[#1E40AF] dark:text-blue-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              {t('chatTitle', 'Scheme Navigator Assistant')}
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/15 text-[#1E40AF] dark:text-blue-400 font-semibold border border-blue-500/30">
                {t('ragGroundedBadge', 'RAG Grounded')}
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('chatSubtitle', 'Official Knowledge Base • Auto-Translates English, Hindi & regional languages')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Globe className="w-3.5 h-3.5" />
          <span>{t('multilingualBadge', 'Multilingual')}</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isBot = msg.role === 'assistant';
          return (
            <div key={msg.id} className={`flex gap-3 ${isBot ? 'items-start' : 'items-start flex-row-reverse'}`}>
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                  isBot
                    ? 'bg-[#1E40AF] text-white'
                    : 'bg-slate-800 dark:bg-blue-900 text-white'
                }`}
              >
                {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              <div className={`max-w-[82%] space-y-2`}>
                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isBot
                      ? 'bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60 rounded-tl-sm'
                      : 'bg-[#1E40AF] text-white rounded-tr-sm shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.content}</p>

                  {/* Field Update Success Pill */}
                  {msg.field_updated && (
                    <div className="mt-2.5 pt-2 border-t border-emerald-500/30 flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-300 font-semibold">
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{t('profileUpdatedNotice', 'Profile updated. Verdict re-evaluated above!')}</span>
                    </div>
                  )}
                </div>

                {/* Citation Tags */}
                {isBot && msg.citations && msg.citations.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {msg.citations.map((cit, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedCitation(cit)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/20 transition-colors"
                        title="Click to view verified source excerpt"
                      >
                        <BookOpen className="w-3 h-3 text-blue-500" />
                        <span>[{cit.citation_label}]</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Suggested Prompts Pills */}
                {isBot && msg.suggested_prompts && msg.suggested_prompts.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.suggested_prompts.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(prompt)}
                        className="text-left text-[11px] px-2.5 py-1 rounded-full bg-slate-200/70 dark:bg-slate-800/90 hover:bg-blue-500/15 hover:border-[#1E40AF]/40 text-slate-700 dark:text-slate-300 border border-slate-300/60 dark:border-slate-700 transition-colors"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                )}

                <div
                  className={`text-[10px] text-slate-400 dark:text-slate-500 px-1 ${
                    isBot ? 'text-left' : 'text-right'
                  }`}
                >
                  {msg.timestamp} {msg.detected_language && `• ${msg.detected_language}`}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pl-10">
            <Sparkles className="w-4 h-4 text-[#1E40AF] animate-spin" />
            <span>Consulting official {scheme.short_name} guidelines & verifying criteria...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Selected Citation Drawer / Modal */}
      {selectedCitation && (
        <div className="p-3 bg-blue-50/95 dark:bg-blue-950/90 border-t border-blue-200 dark:border-blue-900 text-xs flex items-start justify-between gap-2 animate-fadeIn">
          <div className="space-y-1">
            <span className="font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              Source Verification: {selectedCitation.citation_label}
            </span>
            <p className="text-blue-800/90 dark:text-blue-300/90 italic">
              "{selectedCitation.source_excerpt}"
            </p>
          </div>
          <button
            onClick={() => setSelectedCitation(null)}
            className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 font-bold px-1.5"
          >
            ✕
          </button>
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 border-t border-slate-200 dark:border-blue-900/30 bg-white dark:bg-[#0D1E38] flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('chatPlaceholder', `Ask about ${scheme.short_name} in any language...`)}
          className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] text-slate-900 dark:text-white"
        />

        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="p-2.5 rounded-xl bg-[#1E40AF] hover:bg-[#1D4ED8] disabled:opacity-50 text-white font-bold transition-all shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
