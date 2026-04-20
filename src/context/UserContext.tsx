import React, { createContext, useContext, useEffect, useState } from "react";

type User = {
  id: string;
  email: string;
  username: string;
  role: "adopter" | "organization";
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthLoading: boolean;
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthLoading(false);
      return;
    }

    if (token === "demo-token-org") {
      setUser({
        id: "demo-org",
        email: "demo@pawpals.se",
        username: "Pawpals Demo Org",
        role: "organization",
      });
      setIsAuthLoading(false);
      return;
    }

    const loadCurrentUser = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Token ogiltig eller utgången");
        }

        const data = await res.json();
        setUser(data.user);
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    };

    void loadCurrentUser();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, isAuthLoading, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser måste användas inom en UserProvider");
  return context;
};
