"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Profile } from "../types";
import { MOCK_PROFILES } from "../mockData";

interface AuthContextType {
  user: Profile | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updatePassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const USER_STORAGE_KEY = "arti_user_session";

// Demo password hashes/checks
const DEMO_CREDENTIALS: Record<string, string> = {
  admin: "admin123",
  anamurotel: "otel123",
  akdenizmarket: "market123",
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        // Sync cookie for middleware
        document.cookie = `arti_user_role=${parsed.role}; path=/; max-age=604800; SameSite=Lax`;
        document.cookie = `arti_user_id=${parsed.id}; path=/; max-age=604800; SameSite=Lax`;
      }
    } catch (e) {
      console.error("Oturum okunamadı:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // 1. Check if Supabase credentials are configured
    const hasSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (hasSupabase) {
      // Supabase Auth Integration
      try {
        const email = `${username.toLowerCase().trim()}@artitemizlik.internal`;
        const { createClient } = await import("../supabase/client");
        const supabase = createClient();
        if (supabase) {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) {
            return { success: false, error: "Kullanıcı adı veya şifre hatalı." };
          }
          if (data.user) {
            // Fetch profile
            const { data: profile } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", data.user.id)
              .single();

            if (profile) {
              setUser(profile);
              localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
              document.cookie = `arti_user_role=${profile.role}; path=/; max-age=604800; SameSite=Lax`;
              document.cookie = `arti_user_id=${profile.id}; path=/; max-age=604800; SameSite=Lax`;
              return { success: true };
            }
          }
        }
      } catch (e) {
        console.warn("Supabase bağlantısı başarısız, yerel denemeye geçiliyor:", e);
      }
    }

    // 2. Mock Fallback / Demo Credentials
    const cleanUser = username.toLowerCase().trim();
    const expectedPassword = DEMO_CREDENTIALS[cleanUser];

    if (!expectedPassword || expectedPassword !== password) {
      return {
        success: false,
        error: "Kullanıcı adı veya şifre hatalı. Lütfen bilgilerinizi kontrol ediniz.",
      };
    }

    const matchedProfile = MOCK_PROFILES.find((p) => p.username === cleanUser);
    if (!matchedProfile) {
      return { success: false, error: "Kullanıcı profili bulunamadı." };
    }

    setUser(matchedProfile);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(matchedProfile));
    document.cookie = `arti_user_role=${matchedProfile.role}; path=/; max-age=604800; SameSite=Lax`;
    document.cookie = `arti_user_id=${matchedProfile.id}; path=/; max-age=604800; SameSite=Lax`;

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    document.cookie = "arti_user_role=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    document.cookie = "arti_user_id=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
  };

  const updatePassword = async (
    oldPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: "Oturum açık değil" };

    if (newPassword.length < 6) {
      return { success: false, error: "Yeni şifre en az 6 karakter olmalıdır." };
    }

    // In demo mode
    if (DEMO_CREDENTIALS[user.username]) {
      if (DEMO_CREDENTIALS[user.username] !== oldPassword) {
        return { success: false, error: "Mevcut şifrenizi yanlış girdiniz." };
      }
      DEMO_CREDENTIALS[user.username] = newPassword;
      return { success: true };
    }

    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
