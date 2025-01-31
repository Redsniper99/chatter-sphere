import { createTheme } from "@mui/material/styles";

export const getDesignTokens = (mode: "light" | "dark") => ({
  palette: {
    mode,
    primary: { main: mode === "dark" ? "#1E88E5" : "#1976D2" },
    secondary: { main: mode === "dark" ? "#ff4081" : "#f50057" },
    background: {
      default: mode === "dark" ? "#121212" : "#ffffff",
      paper: mode === "dark" ? "#1e1e1e" : "#f5f5f5",
    },
    text: {
      primary: mode === "dark" ? "#ffffff" : "#000000",
      secondary: mode === "dark" ? "#b0bec5" : "#757575",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: mode === "dark" ? "#ffffff" : "#000000", // Light border in dark mode
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: mode === "dark" ? "#90caf9" : "#1976D2", // Highlight on hover
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: mode === "dark" ? "#64b5f6" : "#1976D2", // Focus color
          },
          color: mode === "dark" ? "#ffffff" : "#000000", // Ensure text is visible
        },
        input: {
          color: mode === "dark" ? "#ffffff" : "#000000", // Ensure input text is visible
        },
      },
    },
  },
});

export const createAppTheme = (mode: "light" | "dark") => createTheme(getDesignTokens(mode));
