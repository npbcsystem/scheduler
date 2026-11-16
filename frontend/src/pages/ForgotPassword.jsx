import { useState } from "react";
import AuthLayout from "../components/layout/AuthLayout";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { Link } from "react-router-dom";
import api from "../services/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/forgot-password", { email }, { timeout: 25_000 });

      setMessage(response.data.message);
      setEmail("");
    } catch (error) {
      setError(
        error.code === "ECONNABORTED"
          ? "The reset request took too long. Check your inbox before trying again."
          : error.response?.data?.message || "Unable to process your request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Forgot password?" description="Enter your email address to receive a reset link.">
      {message && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!message && (
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            sx={{
              mt: 3,
              py: 1.4,
              fontWeight: 600,
            }}
          >
            {loading ? (
              <><CircularProgress size={20} color="inherit" sx={{ mr: 1 }} /> Sending reset link</>
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </Box>
      )}

      <Button
        component={Link}
        to="/login"
        startIcon={<ArrowBackIcon />}
        sx={{
          mt: 2,
          textTransform: "none",
        }}
      >
        Back to Login
      </Button>
    </AuthLayout>
  );
};

export default ForgotPassword;
