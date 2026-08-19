import axios from "axios";

const ADVANTA_URL =
  process.env.ADVANTA_SMS_URL ||
  "https://quicksms.advantasms.com";

export const sendSMS = async (
  mobile,
  message
) => {
  try {
    const response = await axios.post(
      `${ADVANTA_URL}/api/services/sendsms`,
      {
        apikey:
          process.env.ADVANTA_API_KEY,

        partnerID:
          process.env.ADVANTA_PARTNER_ID,

        message,

        shortcode:
          process.env.ADVANTA_SHORTCODE,

        mobile,
      },
      {
        headers: {
          "Content-Type":
            "application/json",
        },
      }
    );

    return response.data;

  } catch (error) {

    console.error(
      "ADVANTA SMS ERROR:",
      error.response?.data ||
        error.message
    );

    throw new Error(
      "Unable to send SMS."
    );
  }
};