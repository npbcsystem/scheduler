import {
  sendSMS,
} from "../services/smsService.js";

export const testSMS = async (
  req,
  res
) => {
  try {

    const {
      mobile,
      message,
    } = req.body;

    if (!mobile) {
      return res.status(400).json({
        message:
          "Mobile number is required.",
      });
    }

    if (!message) {
      return res.status(400).json({
        message:
          "Message is required.",
      });
    }

    const result =
      await sendSMS(
        mobile,
        message
      );

    res.json({
      success: true,
      result,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};