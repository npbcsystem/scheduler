import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import crypto from "crypto";

import { sendEmail } from "../services/emailService.js";

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    if (!user.active) {
      return res.status(403).json({
        message: "This account has been disabled.",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      message: "Unable to login.",
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email address is required.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    // Do not reveal whether an email exists in the system.
    if (!user || !user.active) {
      return res.json({
        message:
          "If an account exists with that email, a password reset link has been sent.",
      });
    }

    // Generate secure random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Store only a hash of the token
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;

    // Token expires in 30 minutes
    user.resetPasswordExpires = new Date(
      Date.now() + 30 * 60 * 1000
    );

    await user.save();

    const frontendUrl =
      process.env.FRONTEND_URL || "http://localhost:5173";

    const resetUrl =
      `${frontendUrl}/reset-password/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: "NPBC Scheduler - Password Reset",
      text: `
NPBC Scheduler

We received a request to reset your password.

Use the following link to create a new password:

${resetUrl}

This link will expire in 30 minutes.

If you did not request a password reset, you can safely ignore this email.

Nairobi Pentecostal Bible College
      `,
      html: `
        <div style="font-family: Arial, sans-serif; background:#f5f7fa; padding:30px;">
          <div style="
            max-width:600px;
            margin:auto;
            background:white;
            padding:35px;
            border-radius:10px;
            border:1px solid #e6ecf4;
          ">

            <h2 style="color:#102A43; margin-bottom:5px;">
              NPBC Scheduler
            </h2>

            <p style="color:#64748B; margin-top:0;">
              Nairobi Pentecostal Bible College
            </p>

            <hr style="border:none;border-top:1px solid #e6ecf4;margin:25px 0;" />

            <h3 style="color:#102A43;">
              Password Reset Request
            </h3>

            <p style="color:#475569;line-height:1.6;">
              We received a request to reset your NPBC Scheduler password.
            </p>

            <p style="color:#475569;line-height:1.6;">
              Click the button below to create a new password.
            </p>

            <div style="text-align:center;margin:30px 0;">
              <a
                href="${resetUrl}"
                style="
                  display:inline-block;
                  background:#1769E0;
                  color:white;
                  text-decoration:none;
                  padding:13px 25px;
                  border-radius:6px;
                  font-weight:bold;
                "
              >
                Reset Password
              </a>
            </div>

            <p style="font-size:13px;color:#64748B;line-height:1.6;">
              This link will expire in <strong>30 minutes</strong>.
            </p>

            <p style="font-size:13px;color:#64748B;line-height:1.6;">
              If you did not request a password reset, you can safely
              ignore this email.
            </p>

            <hr style="border:none;border-top:1px solid #e6ecf4;margin:25px 0;" />

            <p style="font-size:12px;color:#94A3B8;">
              Nairobi Pentecostal Bible College<br />
              NPBC Scheduler
            </p>

          </div>
        </div>
      `,
    });

    return res.json({
      message:
        "If an account exists with that email, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);

    return res.status(500).json({
      message: "Unable to process password reset request.",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token) {
      return res.status(400).json({
        message: "Reset token is required.",
      });
    }

    if (!password) {
      return res.status(400).json({
        message: "New password is required.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters.",
      });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: {
        $gt: new Date(),
      },
    });

    if (!user) {
      return res.status(400).json({
        message:
          "This password reset link is invalid or has expired.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    user.password = hashedPassword;

    // Invalidate token immediately after use
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    return res.json({
      message:
        "Password reset successfully. You can now login with your new password.",
    });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);

    return res.status(500).json({
      message: "Unable to reset password.",
    });
  }
};