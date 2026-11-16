import { Box, Paper, Stack, Typography } from "@mui/material";
import { brand } from "../../theme";

export default function AuthLayout({ title, description, children }) {
  return (
    <Box
      component="main"
      sx={{
        minHeight: "100dvh", display: "grid", placeItems: "center",
        px: { xs: 1.5, sm: 3 }, py: 3,
        background: "radial-gradient(ellipse at top left, #dce9f8, transparent 65%), #eff4fa",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%", maxWidth: 920, display: "grid",
          gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "0.95fr 1.05fr" },
          border: "1px solid", borderColor: "divider", borderRadius: "24px",
          overflow: "hidden", boxShadow: "0 24px 75px #183a5921",
        }}
      >
        <Stack
          spacing={2}
          sx={{
            alignItems: { xs: "center", md: "flex-start" }, justifyContent: "center",
            color: "#fff", background: brand.banner,
            p: { xs: 2, md: 5 }, minHeight: { md: 440 },
          }}
        >
          <Box
            component="img"
            src="/npbc-logo-2.png"
            alt="NPBC"
            sx={{ width: { xs: 48, md: 72 }, height: { xs: 48, md: 72 }, objectFit: "contain", bgcolor: "#fff", borderRadius: 2, p: 0.75 }}
          />
          <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
            <Typography variant="h5" component="div" sx={{ fontSize: { xs: "1.1rem", md: "1.85rem" } }}>
              Nairobi Pentecostal Bible College
            </Typography>
            <Typography variant="body2" sx={{ color: brand.brass, mt: 0.75 }}>Academic scheduling</Typography>
          </Box>
        </Stack>
        <Box sx={{ p: { xs: 2.5, sm: 4, md: 5 }, alignSelf: "center" }}>
          <Typography component="h1" variant="h4">{title}</Typography>
          {description && <Typography color="text.secondary" sx={{ mt: 0.75 }}>{description}</Typography>}
          <Box sx={{ mt: 3 }}>{children}</Box>
        </Box>
      </Paper>
    </Box>
  );
}
