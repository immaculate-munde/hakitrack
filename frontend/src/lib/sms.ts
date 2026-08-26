import Africastalking from "africastalking";
import { normalizePhone } from "@/lib/case-status";

export async function sendSMS(phoneNumber: string, message: string) {
  const apiKey = process.env.AT_API_KEY;
  const username = process.env.AT_USERNAME;

  if (!apiKey || !username) {
    console.warn("[HakiTrack SMS] Missing AT credentials — skipping send");
    console.log(`[HakiTrack SMS] Would send to ${phoneNumber}: ${message}`);
    return null;
  }

  const client = Africastalking({ apiKey, username });
  const sms = client.SMS;
  const senderId = process.env.AT_SENDER_ID?.trim();

  try {
    const payload: { to: string[]; message: string; from?: string } = {
      to: [normalizePhone(phoneNumber)],
      message,
    };

    if (senderId) {
      payload.from = senderId;
    }

    const response = await sms.send(payload);
    const recipients = response?.SMSMessageData?.Recipients ?? [];
    const failed = recipients.filter(
      (r: { status?: string }) => r.status !== "Success",
    );

    if (failed.length > 0) {
      console.error("[HakiTrack SMS] Delivery issue:", failed);
    } else {
      console.info("[HakiTrack SMS] Sent:", {
        to: phoneNumber.slice(-4),
        sender: senderId || "(account default)",
      });
    }

    return response;
  } catch (error) {
    console.error("[HakiTrack SMS] Failed:", error);
    return null;
  }
}
