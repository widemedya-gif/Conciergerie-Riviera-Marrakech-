import React, { useState } from "react";
import { useStore } from "@/src/store/useStore";
import { User } from "@/src/types";
import { Search, Shield, User as UserIcon, Mail } from "lucide-react";

export const AdminUsers = () => {
  const mockUsers = useStore((state) => state.mockUsers);
  const setMockUsers = useStore((state) => state.setMockUsers);
  const addNotification = useStore((state) => state.addNotification);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = mockUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleUserRole = (id: string) => {
    const updatedUsers = mockUsers.map(u => {
      if (u.id === id) {
        const newRole = u.role === "admin" ? "user" : "admin";
        return { ...u, role: newRole as "admin" | "user" };
      }
      return u;
    });
    setMockUsers(updatedUsers);
    addNotification("Rôle utilisateur mis à jour", "success");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif text-luxury-black dark:text-white">Gestion des Utilisateurs</h2>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
        <input
          type="text"
          placeholder="Rechercher par nom ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-luxury-gold outline-none"
        />
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800">
              <th className="p-4 font-medium text-sm text-neutral-500">Utilisateur</th>
              <th className="p-4 font-medium text-sm text-neutral-500">Email</th>
              <th className="p-4 font-medium text-sm text-neutral-500">Rôle</th>
              <th className="p-4 font-medium text-sm text-neutral-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-neutral-200 dark:border-neutral-800 last:border-0 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center overflow-hidden">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon size={20} className="text-neutral-400" />
                      )}
                    </div>
                    <span className="font-medium">{user.name}</span>
                  </div>
                </td>
                <td className="p-4 text-neutral-500 flex items-center gap-2">
                  <Mail size={14} /> {user.email}
                </td>
                <td className="p-4">
                  {user.role === "admin" ? (
                    <span className="px-2 py-1 bg-luxury-gold/10 text-luxury-gold rounded-full text-xs font-bold flex items-center gap-1 w-fit">
                      <Shield size={12} /> Admin
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
                      <UserIcon size={12} /> User
                    </span>
                  )}
                </td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => toggleUserRole(user.id)}
                    className="text-sm font-medium text-luxury-gold hover:underline"
                  >
                    {user.role === "admin" ? "Rétrograder" : "Promouvoir Admin"}
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-neutral-500">
                  Aucun utilisateur trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
