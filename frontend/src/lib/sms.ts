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
  const from = process.env.AT_SENDER_ID ?? "HAKITRACK";

  try {
    const response = await sms.send({
      to: [normalizePhone(phoneNumber)],
      message,
      from,
    });
    return response;
  } catch (error) {
    console.error("[HakiTrack SMS] Failed:", error);
    return null;
  }
}
