import { prisma } from "./prisma";

export async function createNotification(
  userId: string,
  type: string,
  title: string,
  message: string
) {
  return prisma.notification.create({
    data: { userId, type, title, message },
  });
}

export async function sendOrderConfirmationEmail(
  email: string,
  orderNumber: string,
  total: number
) {
  if (!process.env.SMTP_HOST) {
    console.log(`[Email] Order confirmation to ${email}: ${orderNumber} - ₹${total}`);
    return;
  }
  // Integrate with Nodemailer/SendGrid in production
  console.log(`[Email] Sent order confirmation to ${email}`);
}

export async function sendOrderConfirmationSMS(phone: string, orderNumber: string) {
  if (!process.env.SMS_API_KEY) {
    console.log(`[SMS] Order confirmation to ${phone}: ${orderNumber}`);
    return;
  }
  // Integrate with Twilio/MSG91 in production
  console.log(`[SMS] Sent order confirmation to ${phone}`);
}

export async function sendPaymentStatusUpdate(
  userId: string,
  orderNumber: string,
  status: string
) {
  await createNotification(
    userId,
    "payment",
    "Payment Update",
    `Payment for order ${orderNumber} is now ${status}.`
  );
}
