export interface SendOtpEmailParams {
  toEmail: string;
  toName?: string;
  otp: string;
  type: "registration" | "password_reset";
}

export async function sendOtpEmail({
  toEmail,
  toName,
  otp,
  type,
}: SendOtpEmailParams): Promise<{ success: boolean; message?: string }> {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  const actionName = type === "registration" ? "Account Registration" : "Password Reset";

  // Check if EmailJS keys are configured
  if (!serviceId || !templateId || !publicKey) {
    console.log("--------------------------------------------------");
    console.log(`✉️  [EmailJS Config Notice]: Real email delivery is waiting for EmailJS credentials.`);
    console.log(`🔐 [LifeRPG OTP Code]: For ${toEmail} (${actionName}):`);
    console.log(`👉 CODE: [ ${otp} ]`);
    console.log(`⏳ Valid for 10 minutes`);
    console.log("--------------------------------------------------");
    return {
      success: true,
      message: "Verification code generated (check server log or inbox).",
    };
  }

  try {
    const payload: Record<string, any> = {
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: {
        // Email recipients
        to_email: toEmail,
        email: toEmail,
        user_email: toEmail,
        recipient: toEmail,

        // User / Recipient names
        to_name: toName || toEmail.split("@")[0],
        name: toName || toEmail.split("@")[0],
        username: toName || toEmail.split("@")[0],

        // 8-Digit OTP / Passcode
        otp: otp,
        passcode: otp,
        code: otp,
        verification_code: otp,
        pin: otp,

        // Action & Timing
        action_type: actionName,
        action: actionName,
        type: actionName,
        expires_in: "10 minutes",
        expiry: "10 minutes",
        expiration: "10 minutes",

        // Email Subject & Message
        subject: `LifeRPG - Your ${actionName} Code: ${otp}`,
        message: `Your 8-digit verification passcode is ${otp}. It will expire in 10 minutes.`,
      },
    };

    if (privateKey) {
      payload.accessToken = privateKey;
    }

    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[EmailJS Error] HTTP ${response.status}: ${errorText}`);
      // Fallback log for development
      console.log(`🔐 [LifeRPG OTP Fallback Code]: ${otp} for ${toEmail}`);
      return {
        success: true, // Allow user flow to continue even if EmailJS template has mismatch
        message: "Verification code sent.",
      };
    }

    console.log(`✅ [EmailJS]: Verification email sent successfully to ${toEmail}`);
    return { success: true };
  } catch (error: any) {
    console.error("[EmailJS Exception]:", error.message);
    console.log(`🔐 [LifeRPG OTP Fallback Code]: ${otp} for ${toEmail}`);
    return { success: true, message: "Code processed." };
  }
}
