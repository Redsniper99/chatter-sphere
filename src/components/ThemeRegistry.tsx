"use client";

import { useState, useMemo, createContext, ReactNode } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { createAppTheme } from "../theme/theme"; // Adjust import if needed

export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<"light" | "dark">("light");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
