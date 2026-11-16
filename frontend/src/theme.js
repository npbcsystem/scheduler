import { alpha, createTheme } from "@mui/material/styles";

export const brand = {
  ink: "#102a43",
  blue: "#1769e0",
  paleBlue: "#eaf2ff",
  brass: "#ead09a",
  canvas: "#f4f7fb",
  line: "#dce5f0",
  muted: "#53657c",
  banner: "radial-gradient(ellipse at top right, #205a8c, transparent 70%), linear-gradient(115deg, #0e2438, #133757)",
};

export const theme = createTheme({
  palette: {
    primary: { main: brand.blue, dark: "#0d47a1", light: brand.paleBlue },
    secondary: { main: "#775622", light: "#f7edd7" },
    success: { main: "#237b52" },
    warning: { main: "#9b5b16" },
    error: { main: "#b6374a" },
    info: { main: "#326887" },
    background: { default: brand.canvas, paper: "#fff" },
    text: { primary: brand.ink, secondary: brand.muted },
    divider: brand.line,
    action: { hover: alpha(brand.blue, 0.055), selected: alpha(brand.blue, 0.10) },
  },
  typography: {
    fontFamily: 'Inter, "Segoe UI", Arial, sans-serif',
    h4: { fontSize: "1.875rem", fontWeight: 750, letterSpacing: "-0.045em" },
    h5: { fontWeight: 750, letterSpacing: "-0.035em" },
    h6: { fontWeight: 700, letterSpacing: "-0.025em" },
    button: { fontWeight: 700, textTransform: "none", letterSpacing: 0 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "::selection": { backgroundColor: alpha(brand.blue, 0.18) },
        ":focus-visible": { outline: "2px solid #4275ac", outlineOffset: 2 },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 9, minHeight: 40, paddingInline: 16 },
        containedPrimary: {
          background: "linear-gradient(120deg, #1769e0, #267fe8)",
          boxShadow: "0 3px 7px #0d47a128",
          "&:hover": { background: "#0d47a1" },
          "&.Mui-disabled": { background: "rgba(0, 0, 0, 0.12)" },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none" },
        elevation1: { border: `1px solid ${brand.line}`, boxShadow: "0 6px 24px #102a4308" },
        outlined: { borderColor: brand.line },
      },
    },
    MuiCard: { styleOverrides: { root: { border: `1px solid ${brand.line}` } } },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#fff",
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#cbd8e7" },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#829bb7" },
        },
      },
    },
    MuiTableContainer: { styleOverrides: { root: { overflowX: "auto" } } },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: "#edf3fa", color: "#405a78", fontWeight: 750,
          fontSize: "0.72rem", letterSpacing: "0.065em", textTransform: "uppercase",
          whiteSpace: "nowrap",
        },
        root: { borderBottom: "1px solid #e9eff6" },
      },
    },
    MuiChip: { styleOverrides: { root: { fontWeight: 650, borderRadius: 7 } } },
    MuiDialog: { styleOverrides: { paper: { borderRadius: 18, border: `1px solid ${brand.line}` } } },
    MuiDialogTitle: { styleOverrides: { root: { borderBottom: `1px solid ${brand.line}`, backgroundColor: "#f6f8fc", fontWeight: 750 } } },
    MuiDialogActions: { styleOverrides: { root: { padding: "14px 24px", borderTop: `1px solid ${brand.line}` } } },
    MuiLinearProgress: { styleOverrides: { bar: { borderRadius: "inherit" } } },
  },
});
