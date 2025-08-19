"use client";

import React, { useEffect, useState } from "react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Trigger hydration after component mounts
    setIsHydrated(true);
  }, []);

  // Don't render auth-dependent content until hydrated
  if (!isHydrated) {
    return <div>{children}</div>;
  }

  return <div>{children}</div>;
}
