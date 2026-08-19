import { createContext, useContext, useState, type ReactNode } from "react";

export const DEMO_USERS = [
  { id: "u1", name: "User 1 — no knowledge" },
  { id: "u2", name: "User 2 — knows JS, SQL" },
  { id: "u3", name: "User 3 — knows JS, SQL, Linux, HTTP" },
];

interface UserContextValue {
  userId: string;
  setUserId: (id: string) => void;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState("u1");
  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
}
