import { type ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "../context/UserContext";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
  <BrowserRouter>
  <UserProvider>

  {children}
  
  </UserProvider>
  </BrowserRouter>
  )
}
