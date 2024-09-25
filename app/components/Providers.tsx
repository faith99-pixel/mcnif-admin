// import { store } from "@/app/redux/store";
import { SessionProvider } from "next-auth/react";
// import { Provider } from "react-redux";


export function SessionProviders({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
