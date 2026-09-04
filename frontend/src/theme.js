import { alpha, createTheme } from "@mui/material/styles";

const navy = "#102A43";
const blue = "#1769E0";

export const theme = createTheme({
  palette: {
    primary: { main: blue, dark: "#0D47A1", light: "#EAF2FF" },
    secondary: { main: "#00A78E" },
    success: { main: "#168B5A" },
    warning: { main: "#E28A16" },
    error: { main: "#D14343" },
    background: { default: "#F4F7FB", paper: "#FFFFFF" },
    text: { primary: navy, secondary: "#62738A" },
  },
  typography: {
    fontFamily: 'Inter, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    h4: { fontSize: "1.75rem", fontWeight: 750, letterSpacing: "-0.035em" },
    h5: { fontWeight: 750, letterSpacing: "-0.025em" },
    h6: { fontWeight: 700, letterSpacing: "-0.015em" },
    button: { fontWeight: 700, textTransform: "none", letterSpacing: 0 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: "#F4F7FB" },
        "::selection": { backgroundColor: alpha(blue, 0.18) },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 9, boxShadow: "none", minHeight: 40, paddingInline: 18 },
        contained: { boxShadow: "0 6px 16px rgba(23, 105, 224, 0.20)", "&:hover": { boxShadow: "0 8px 20px rgba(23, 105, 224, 0.28)" } },
      },
    },
    MuiPaper: { styleOverrides: { root: { border: "1px solid #E6ECF4", boxShadow: "0 3px 12px rgba(16, 42, 67, 0.035)" } } },
    MuiCard: { styleOverrides: { root: { border: "1px solid #E6ECF4", boxShadow: "0 3px 12px rgba(16, 42, 67, 0.045)" } } },
    MuiOutlinedInput: { styleOverrides: { root: { backgroundColor: "#FFF", "& .MuiOutlinedInput-notchedOutline": { borderColor: "#D8E1ED" }, "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#AABCD1" } } } },
    MuiTableCell: {
      styleOverrides: {
        head: { backgroundColor: "#F7F9FC", color: "#53657C", fontWeight: 750, fontSize: "0.76rem", letterSpacing: "0.03em", textTransform: "uppercase", borderBottom: "1px solid #E6ECF4" },
        root: { borderBottom: "1px solid #EDF1F6" },
      },
    },
    MuiChip: { styleOverrides: { root: { fontWeight: 650, borderRadius: 7 } } },
  },
});
