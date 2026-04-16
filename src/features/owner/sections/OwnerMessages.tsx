import React, { useState } from "react";
import { motion } from "motion/react";
import { Search, Send, MoreVertical, Phone, Video, User, Check, CheckCheck, MessageSquare } from "lucide-react";
import { useStore } from "@/src/store/useStore";
import { cn } from "@/src/lib/utils";

export const OwnerMessages = () => {
  const { ownerMessages } = useStore();
  const [selectedChat, setSelectedChat] = useState<string | null>(ownerMessages[0]?.id || null);
  const [messageText, setMessageText] = useState("");

  const activeChat = ownerMessages.find(m => m.id === selectedChat);

  const mockChatHistory = [
    { id: 1, sender: "client", text: "Bonjour, je suis très intéressé par votre villa à Marrakech.", time: "10:30" },
    { id: 2, sender: "owner", text: "Bonjour ! Ravi de l'entendre. Avez-vous des questions spécifiques ?", time: "10:35" },
    { id: 3, sender: "client", text: "Oui, est-ce que la piscine est chauffée ?", time: "10:36" },
    { id: 4, sender: "owner", text: "Absolument, elle est chauffée toute l'année à 28°C.", time: "10:40" },
  ];

  return (
    <div className="h-[calc(100vh-12rem)] flex bg-white dark:bg-neutral-900 rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800 overflow-hidden shadow-xl shadow-black/5">
      {/* Sidebar */}
      <div className="w-full sm:w-80 border-r border-neutral-100 dark:border-neutral-800 flex flex-col">
        <div className="p-6 border-b border-neutral-100 dark:border-neutral-800">
          <h2 className="text-xl font-bold text-luxury-black dark:text-white mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
            <input 
              type="text" 
              placeholder="Rechercher..."
              className="w-full pl-10 pr-4 py-2 bg-neutral-50 dark:bg-neutral-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-luxury-gold/20 transition-all"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {ownerMessages.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              className={cn(
                "w-full p-4 flex gap-4 transition-all border-b border-neutral-50 dark:border-neutral-800/50 last:border-0",
                selectedChat === chat.id ? "bg-luxury-gold/5 border-l-4 border-l-luxury-gold" : "hover:bg-neutral-50 dark:hover:bg-neutral-800"
              )}
            >
              <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0 overflow-hidden border border-neutral-200 dark:border-neutral-700">
                {chat.senderAvatar ? (
                  <img src={chat.senderAvatar} alt={chat.senderName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <User size={20} className="text-neutral-400" />
                )}
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-sm text-luxury-black dark:text-white truncate">{chat.senderName}</h4>
                  <span className="text-[10px] text-neutral-400 font-medium whitespace-nowrap">10:40</span>
                </div>
                <p className={cn(
                  "text-xs truncate",
                  chat.isUnread ? "text-luxury-black dark:text-white font-bold" : "text-neutral-500"
                )}>
                  {chat.content}
                </p>
              </div>
              {chat.isUnread && (
                <div className="w-2 h-2 bg-luxury-gold rounded-full mt-2 shrink-0" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-neutral-50/30 dark:bg-neutral-900/30">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 sm:p-6 bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center overflow-hidden border border-neutral-200 dark:border-neutral-700">
                  {activeChat.senderAvatar ? (
                    <img src={activeChat.senderAvatar} alt={activeChat.senderName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <User size={18} className="text-neutral-400" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-luxury-black dark:text-white">{activeChat.senderName}</h4>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">En ligne</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 transition-colors">
                  <Phone size={18} />
                </button>
                <button className="p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 transition-colors">
                  <Video size={18} />
                </button>
                <button className="p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 transition-colors">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="flex justify-center">
                <span className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Aujourd'hui</span>
              </div>
              
              {mockChatHistory.map((msg) => (
                <div key={msg.id} className={cn(
                  "flex",
                  msg.sender === "owner" ? "justify-end" : "justify-start"
                )}>
                  <div className={cn(
                    "max-w-[80%] p-4 rounded-2xl text-sm shadow-sm",
                    msg.sender === "owner" 
                      ? "bg-luxury-black text-white rounded-tr-none" 
                      : "bg-white dark:bg-neutral-800 text-luxury-black dark:text-white rounded-tl-none border border-neutral-100 dark:border-neutral-700"
                  )}>
                    <p className="leading-relaxed">{msg.text}</p>
                    <div className={cn(
                      "flex items-center gap-1 mt-2",
                      msg.sender === "owner" ? "justify-end" : "justify-start"
                    )}>
                      <span className="text-[10px] opacity-50">{msg.time}</span>
                      {msg.sender === "owner" && <CheckCheck size={12} className="text-luxury-gold" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800">
              <form 
                onSubmit={(e) => { e.preventDefault(); setMessageText(""); }}
                className="flex items-center gap-4"
              >
                <input 
                  type="text" 
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Écrivez votre message..."
                  className="flex-1 px-6 py-3.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-luxury-gold/20 focus:border-luxury-gold transition-all text-sm"
                />
                <button 
                  type="submit"
                  disabled={!messageText.trim()}
                  className="w-12 h-12 bg-luxury-gold text-white rounded-2xl flex items-center justify-center shadow-lg shadow-luxury-gold/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-20 h-20 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-6">
              <MessageSquare size={32} className="text-neutral-300" />
            </div>
            <h3 className="text-xl font-bold text-luxury-black dark:text-white mb-2">Vos conversations</h3>
            <p className="text-neutral-500 max-w-xs">Sélectionnez une conversation pour commencer à discuter avec vos clients.</p>
          </div>
        )}
      </div>
    </div>
  );
};
