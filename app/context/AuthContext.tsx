'use client'
import React, { FunctionComponent, ReactNode } from 'react';
import { SessionProvider } from "next-auth/react"

interface AuthContextProps {
  children: ReactNode | ReactNode[]
}

export const AuthProvider: FunctionComponent<{children: ReactNode}> = ({ children }) => {

  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
};