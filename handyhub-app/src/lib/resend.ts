import { Resend } from "resend";

let client: Resend | null = null;

function getResend(): Resend {
  if (client) return client;

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error(
      "RESEND_API_KEY is not set. Get one at https://resend.com/api-keys"
    );
  }

  client = new Resend(key);
  return client;
}

interface QuoteNotificationParams {
  contractorEmail: string;
  contractorName: string;
  description: string;
  timeline: string;
  zipCode: string;
  senderName?: string;
  senderEmail?: string;
}

export async function sendQuoteNotification({
  contractorEmail,
  contractorName,
  description,
  timeline,
  zipCode,
  senderName,
  senderEmail,
}: QuoteNotificationParams) {
  const resend = getResend();

  const replyLine = senderEmail
    ? `<p><strong>Reply to:</strong> ${senderEmail}</p>`
    : "";

  await resend.emails.send({
    from: "HandyHub <onboarding@resend.dev>",
    to: contractorEmail,
    subject: `New Quote Request on HandyHub`,
    html: `
      <h2>New Quote Request</h2>
      <p>Hi ${contractorName},</p>
      <p>You have a new quote request on HandyHub!</p>
      <hr />
      <p><strong>Project Description:</strong></p>
      <p>${description}</p>
      <p><strong>Timeline:</strong> ${timeline}</p>
      <p><strong>ZIP Code:</strong> ${zipCode}</p>
      ${senderName ? `<p><strong>From:</strong> ${senderName}</p>` : ""}
      ${replyLine}
      <hr />
      <p>Log in to your HandyHub dashboard to respond.</p>
    `,
  });
}
