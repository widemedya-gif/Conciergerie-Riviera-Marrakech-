import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Send, 
  MoreVertical, 
  Phone, 
  Video, 
  User, 
  Check, 
  CheckCheck, 
  MessageSquare,
  Building2,
  Info,
  ArrowLeft
} from "lucide-react";
import { useStore } from "@/src/store/useStore";
import { cn } from "@/src/lib/utils";

export const ClientMessages = () => {
  const { clientConversations = [], addClientMessage, user } = useStore();
  const [selectedConvId, setSelectedConvId] = useState<string | null>((clientConversations || [])[0]?.id || null);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileChat, setShowMobileChat] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConvId, clientConversations]);

  const activeConversation = clientConversations.find(c => c.id === selectedConvId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConvId) return;

    const msg = {
      id: `m-${Date.now()}`,
      senderId: user?.id || "client",
      senderName: user?.name || "Client",
      content: newMessage,
      timestamp: new Date().toISOString(),
      isUnread: false
    };

    addClientMessage(selectedConvId, msg);
    setNewMessage("");

    // Simulate owner reply
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const reply = {
        id: `m-${Date.now() + 1}`,
        senderId: activeConversation?.participantId || "owner",
        senderName: activeConversation?.participantName || "Propriétaire",
        content: "Merci pour votre message. Je reviens vers vous très rapidement avec plus de détails.",
        timestamp: new Date().toISOString(),
        isUnread: true
      };
      addClientMessage(selectedConvId, reply);
    }, 3000);
  };

  const filteredConversations = clientConversations.filter(c => 
    c.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.propertyName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-12rem)] bg-white dark:bg-neutral-900 rounded-[40px] border border-neutral-100 dark:border-neutral-800 overflow-hidden flex shadow-2xl shadow-black/5">
      {/* Sidebar */}
      <div className={cn(
        "w-full md:w-80 lg:w-96 border-r border-neutral-100 dark:border-neutral-800 flex flex-col shrink-0",
        showMobileChat ? "hidden md:flex" : "flex"
      )}>
        <div className="p-6 border-b border-neutral-100 dark:border-neutral-800">
          <h2 className="text-xl font-serif font-bold text-luxury-black dark:text-white mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-luxury-gold/20"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => {
                  setSelectedConvId(conv.id);
                  setShowMobileChat(true);
                }}
                className={cn(
                  "w-full p-4 flex gap-4 border-b border-neutral-50 dark:border-neutral-800/50 transition-all text-left group",
                  selectedConvId === conv.id ? "bg-luxury-gold/5 border-l-4 border-l-luxury-gold" : "hover:bg-neutral-50 dark:hover:bg-neutral-800"
                )}
              >
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center font-bold text-luxury-gold overflow-hidden">
                    {conv.participantAvatar ? (
                      <img src={conv.participantAvatar} alt={conv.participantName} className="w-full h-full object-cover" />
                    ) : (
                      conv.participantName.charAt(0)
                    )}
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-luxury-gold text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-neutral-900">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-sm text-luxury-black dark:text-white truncate">{conv.participantName}</h4>
                    <span className="text-[10px] text-neutral-400">{new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mb-1">{conv.lastMessage}</p>
                  {conv.propertyName && (
                    <div className="flex items-center gap-1 text-[9px] text-luxury-gold font-bold uppercase tracking-widest">
                      <Building2 size={10} /> {conv.propertyName}
                    </div>
                  )}
                </div>
              </button>
            ))
          ) : (
            <div className="p-8 text-center">
              <MessageSquare size={32} className="mx-auto text-neutral-200 mb-2" />
              <p className="text-xs text-neutral-400">Aucune conversation</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className={cn(
        "flex-1 flex flex-col bg-neutral-50/30 dark:bg-neutral-900/30",
        !showMobileChat ? "hidden md:flex" : "flex"
      )}>
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="h-20 px-6 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between bg-white dark:bg-neutral-900">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setShowMobileChat(false)}
                  className="md:hidden p-2 -ml-2 text-neutral-500 hover:text-luxury-gold"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center font-bold text-luxury-gold overflow-hidden">
                  {activeConversation.participantAvatar ? (
                    <img src={activeConversation.participantAvatar} alt={activeConversation.participantName} className="w-full h-full object-cover" />
                  ) : (
                    activeConversation.participantName.charAt(0)
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-luxury-black dark:text-white">{activeConversation.participantName}</h3>
                  <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">En ligne</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-400 transition-colors">
                  <Phone size={18} />
                </button>
                <button className="p-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-400 transition-colors">
                  <Video size={18} />
                </button>
                <button className="p-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-400 transition-colors">
                  <Info size={18} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {activeConversation.messages.map((msg, idx) => {
                const isMe = msg.senderId === user?.id;
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, x: isMe ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                      "flex flex-col",
                      isMe ? "items-end" : "items-start"
                    )}
                  >
                    <div className={cn(
                      "max-w-[80%] p-4 rounded-2xl text-sm shadow-sm",
                      isMe 
                        ? "bg-luxury-gold text-white rounded-tr-none" 
                        : "bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-tl-none border border-neutral-100 dark:border-neutral-700"
                    )}>
                      {msg.content}
                    </div>
                    <div className="flex items-center gap-1 mt-1 px-1">
                      <span className="text-[9px] text-neutral-400">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {isMe && (
                        msg.isUnread ? <Check size={10} className="text-neutral-400" /> : <CheckCheck size={10} className="text-blue-400" />
                      )}
                    </div>
                  </motion.div>
                );
              })}
              {isTyping && (
                <div className="flex items-start gap-2">
                  <div className="bg-white dark:bg-neutral-800 p-3 rounded-2xl rounded-tl-none border border-neutral-100 dark:border-neutral-700">
                    <div className="flex gap-1">
                      <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-neutral-400 rounded-full" />
                      <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-neutral-400 rounded-full" />
                      <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-neutral-400 rounded-full" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800">
              <form onSubmit={handleSendMessage} className="flex items-center gap-4 bg-neutral-50 dark:bg-neutral-800 p-2 rounded-2xl border border-neutral-100 dark:border-neutral-700 focus-within:ring-2 focus-within:ring-luxury-gold/20 transition-all">
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Écrivez votre message..." 
                  className="flex-1 bg-transparent border-none outline-none px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300"
                />
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="w-10 h-10 bg-luxury-gold text-white rounded-xl flex items-center justify-center hover:bg-luxury-gold/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-luxury-gold/20"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-24 h-24 bg-neutral-100 dark:bg-neutral-800 rounded-[40px] flex items-center justify-center mb-6 text-neutral-300">
              <MessageSquare size={48} />
            </div>
            <h3 className="text-xl font-serif font-bold text-luxury-black dark:text-white mb-2">Sélectionnez une conversation</h3>
            <p className="text-neutral-500 dark:text-neutral-400 max-w-xs">
              Choisissez un propriétaire dans la liste pour commencer à discuter ou poser vos questions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
