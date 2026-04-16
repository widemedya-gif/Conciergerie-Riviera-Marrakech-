import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { useStore } from "@/src/store/useStore";
import { cn } from "@/src/lib/utils";

export default function NotificationSystem() {
  const { notifications, removeNotification } = useStore();

  return (
    <div className="fixed bottom-8 right-8 z-[200] flex flex-col gap-4 pointer-events-none">
      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={cn(
              "pointer-events-auto flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-md min-w-[300px]",
              n.type === "success" && "bg-white/90 border-green-100 text-green-800",
              n.type === "error" && "bg-white/90 border-red-100 text-red-800",
              n.type === "info" && "bg-white/90 border-blue-100 text-blue-800"
            )}
          >
            {n.type === "success" && <CheckCircle2 className="text-green-500" size={20} />}
            {n.type === "error" && <AlertCircle className="text-red-500" size={20} />}
            {n.type === "info" && <Info className="text-blue-500" size={20} />}
            
            <p className="flex-1 text-sm font-medium">{n.message}</p>
            
            <button 
              onClick={() => removeNotification(n.id)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={16} className="text-gray-400" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
