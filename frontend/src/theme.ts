import { alpha, createTheme } from "@mui/material/styles";

const colors = {
  background: "#E8E2CE",
  paper: "#F3EEDC",
  moss: "#58745A",
  darkMoss: "#354A38",
  leaf: "#A9C29B",
  shell: "#A97847",
  goldenShell: "#D7B85C",
  text: "#30392F",
  mutedText: "#687165",
};

const clayShadow = `
  10px 12px 24px rgba(78, 69, 48, 0.18),
  -6px -6px 16px rgba(255, 255, 255, 0.55),
  inset 3px 3px 5px rgba(255, 255, 255, 0.45),
  inset -4px -4px 8px rgba(69, 75, 55, 0.12)
`;

const clayHoverShadow = `
  14px 17px 30px rgba(78, 69, 48, 0.22),
  -7px -7px 18px rgba(255, 255, 255, 0.6),
  inset 3px 3px 5px rgba(255, 255, 255, 0.5),
  inset -4px -4px 8px rgba(69, 75, 55, 0.1)
`;

const clayPressedShadow = `
  inset 5px 5px 10px rgba(58, 64, 47, 0.22),
  inset -4px -4px 9px rgba(255, 255, 255, 0.45)
`;

const theme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: colors.moss,
      dark: colors.darkMoss,
      light: colors.leaf,
      contrastText: "#FFFFFF",
    },

    secondary: {
      main: colors.shell,
      light: colors.goldenShell,
      contrastText: "#FFFFFF",
    },

    background: {
      default: colors.background,
      paper: colors.paper,
    },

    text: {
      primary: colors.text,
      secondary: colors.mutedText,
    },

    success: {
      main: "#66875B",
    },

    warning: {
      main: colors.goldenShell,
    },
  },

  shape: {
    borderRadius: 24,
  },

  typography: {
    fontFamily: '"Nunito", "Segoe UI", sans-serif',

    h1: {
      fontWeight: 900,
    },

    h2: {
      fontWeight: 900,
    },

    h3: {
      fontWeight: 900,
    },

    h4: {
      fontWeight: 900,
    },

    h5: {
      fontWeight: 800,
    },

    h6: {
      fontWeight: 800,
    },

    button: {
      fontWeight: 800,
      textTransform: "none",
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
              rgba(255, 255, 255, 0.45),
              transparent 28%
            ),
            linear-gradient(145deg, #EEE8D6 0%, #DED6BC 100%)
          `,
        },

        "*": {
          boxSizing: "border-box",
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 28,
          backgroundImage: "none",
          backgroundColor: colors.paper,
          boxShadow: clayShadow,
          border: "1px solid rgba(255, 255, 255, 0.35)",
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 30,
          backgroundColor: colors.paper,
          boxShadow: clayShadow,
          border: "1px solid rgba(255, 255, 255, 0.4)",
          transition:
            "transform 220ms ease, box-shadow 220ms ease",

          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: clayHoverShadow,
          },
        },
      },
    },

    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },

      variants: [
        {
          props: { variant: "contained", color: "primary" },
          style: {
            backgroundColor: colors.moss,

            "&:hover": {
              backgroundColor: "#617E62",
            },
          },
        },
        {
          props: { variant: "contained", color: "secondary" },
          style: {
            backgroundColor: colors.shell,

            "&:hover": {
              backgroundColor: "#B28150",
            },
          },
        },
      ],

      styleOverrides: {
        root: {
          minHeight: 44,
          paddingInline: 22,
          borderRadius: 999,
          boxShadow: clayShadow,
          transition:
            "transform 180ms cubic-bezier(.2,.8,.2,1), box-shadow 180ms ease",

          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: clayHoverShadow,
          },

          "&:active": {
            transform: "translateY(1px) scale(0.97)",
            boxShadow: clayPressedShadow,
          },
        },

        text: {
          boxShadow: "none",

          "&:hover": {
            boxShadow: "none",
          },

          "&:active": {
            boxShadow: "none",
          },
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: "50%",
          boxShadow: clayShadow,
          transition: "transform 180ms ease, box-shadow 180ms ease",

          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: clayHoverShadow,
          },

          "&:active": {
            transform: "scale(0.94)",
            boxShadow: clayPressedShadow,
          },
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          backgroundColor: "#E5DEC8",
          boxShadow: clayPressedShadow,

          "& fieldset": {
            border: "1px solid rgba(88, 116, 90, 0.18)",
          },

          "&:hover fieldset": {
            borderColor: alpha(colors.moss, 0.45),
          },

          "&.Mui-focused fieldset": {
            borderWidth: 2,
            borderColor: colors.moss,
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 800,
          backgroundColor: colors.leaf,
          boxShadow: `
            4px 5px 10px rgba(78, 69, 48, 0.14),
            inset 2px 2px 4px rgba(255, 255, 255, 0.4),
            inset -2px -2px 4px rgba(53, 74, 56, 0.12)
          `,
        },
      },
    },
  },
});

export default theme;
