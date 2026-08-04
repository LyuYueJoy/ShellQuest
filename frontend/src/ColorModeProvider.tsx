import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";

import lightTheme from "./theme";

type ColorMode = "light" | "dark";

type ColorModeContextValue = {
  mode: ColorMode;
  toggleColorMode: () => void;
};

const STORAGE_KEY = "shellQuestColorMode";

const ColorModeContext = createContext<
  ColorModeContextValue | undefined
>(undefined);

const getInitialMode = (): ColorMode => {
  const savedMode = localStorage.getItem(STORAGE_KEY);

  return savedMode === "dark" ? "dark" : "light";
};

type ColorModeProviderProps = {
  children: ReactNode;
};

export const ColorModeProvider = ({
  children,
}: ColorModeProviderProps) => {
  const [mode, setMode] = useState<ColorMode>(getInitialMode);

  const darkTheme = useMemo(
    () =>
      createTheme(lightTheme, {
        palette: {
          mode: "dark",
          primary: {
            main: "#9DBD91",
            dark: "#78956F",
            light: "#C0D7B6",
            contrastText: "#172019",
          },
          secondary: {
            main: "#D2A16F",
            light: "#E4C18F",
            contrastText: "#21170F",
          },
          background: {
            default: "#182019",
            paper: "#222D24",
          },
          text: {
            primary: "#EDF3E9",
            secondary: "#B8C5B5",
          },
          success: {
            main: "#91B782",
          },
          warning: {
            main: "#D7B85C",
          },
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                minHeight: "100vh",
                background: `
                  radial-gradient(
                    circle at 10% 10%,
                    rgba(157, 189, 145, 0.12),
                    transparent 28%
                  ),
                  linear-gradient(145deg, #1D271F 0%, #111713 100%)
                `,
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundColor: "#222D24",
                borderColor: "rgba(210, 225, 205, 0.10)",
                boxShadow: `
                  10px 12px 24px rgba(0, 0, 0, 0.38),
                  -5px -5px 14px rgba(108, 135, 105, 0.08),
                  inset 3px 3px 5px rgba(255, 255, 255, 0.04),
                  inset -4px -4px 8px rgba(0, 0, 0, 0.20)
                `,
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                backgroundColor: "#222D24",
                borderColor: "rgba(210, 225, 205, 0.10)",
              },
            },
          },
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                backgroundColor: "#18211A",
                color: "#EDF3E9",
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                backgroundColor: "#40533F",
                color: "#EDF3E9",
              },
            },
          },
        },
      }),
    [],
  );

  const theme = mode === "light" ? lightTheme : darkTheme;

  const contextValue = useMemo<ColorModeContextValue>(
    () => ({
      mode,
      toggleColorMode: () => {
        setMode((currentMode) => {
          const nextMode =
            currentMode === "light" ? "dark" : "light";

          localStorage.setItem(STORAGE_KEY, nextMode);
          return nextMode;
        });
      },
    }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export const useColorMode = (): ColorModeContextValue => {
  const context = useContext(ColorModeContext);

  if (context === undefined) {
    throw new Error(
      "useColorMode must be used inside ColorModeProvider.",
    );
  }

  return context;
};