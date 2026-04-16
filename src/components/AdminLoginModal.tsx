import React, { useState } from "react";
import { Modal, Button } from "./ui/BaseComponents";
import { useStore } from "../store/useStore";
import { Lock, Eye, EyeOff } from "lucide-react";

export const AdminLoginModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [code, setCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const toggleAdminMode = useStore((state) => state.toggleAdminMode);
  const addNotification = useStore((state) => state.addNotification);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Strict password check
    if (code.trim() === "Zior2025@@") {
      toggleAdminMode(true);
      addNotification("Mode Administrateur Activé", "success");
      onClose();
    } else {
      addNotification("Code incorrect", "error");
    }
    setCode("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Accès Administrateur" className="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center text-center mb-4">
          <div className="w-16 h-16 bg-luxury-gold/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="text-luxury-gold" size={32} />
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Entrez le code d'accès pour activer le mode administrateur.</p>
        </div>
        <div className="relative">
          <input 
            type={showPassword ? "text" : "password"}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Code d'accès"
            className="w-full px-6 py-4 bg-neutral-50 dark:bg-neutral-900 border-none rounded-2xl focus:ring-2 focus:ring-luxury-gold transition-all text-center text-lg tracking-widest text-luxury-black dark:text-white"
            autoFocus
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-luxury-gold"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <Button type="submit" className="w-full py-4">
          Activer
        </Button>
      </form>
    </Modal>
  );
};