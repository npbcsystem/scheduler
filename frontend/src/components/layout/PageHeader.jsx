import { Box, Paper, Stack, Typography } from "@mui/material";
import { brand } from "../../theme";

export default function PageHeader({ title, description, children }) {
  return (
    <Paper
      component="header"
      elevation={0}
      sx={{
        p: { xs: 2.5, sm: 4 },
        borderRadius: "20px",
        color: "#fff",
        background: brand.banner,
        border: "1px solid #2a557a",
        boxShadow: "0 10px 24px #1537571c",
      }}
    >
      <Stack
        direction={{ xs: "column", lg: "row" }}
        spacing={3}
        sx={{ justifyContent: "space-between", alignItems: { xs: "stretch", lg: "center" } }}
      >
        <Box>
          <Box aria-hidden sx={{ width: 26, height: 3, borderRadius: 2, bgcolor: brand.brass, mb: 1.5 }} />
          <Typography component="h1" variant="h4" sx={{ fontSize: { xs: "1.75rem", md: "2.25rem" } }}>
            {title}
          </Typography>
          <Typography sx={{ color: "#d8e7f6", mt: 0.75, maxWidth: "56ch" }}>
            {description}
          </Typography>
        </Box>
        {children}
      </Stack>
    </Paper>
  );
}
