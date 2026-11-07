const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

export const sendSignupNotification = async (user) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error("Telegram credentials are missing");
    return;
  }

  const registeredAt = new Date().toLocaleString("en-KE", {
    timeZone: "Africa/Nairobi",
    dateStyle: "medium",
    timeStyle: "medium",
  });

  const message = `
🎉 <b>NEW USER SIGNUP</b>

👤 <b>Full Name:</b> ${escapeHtml(user.fullName)}
📧 <b>Email:</b> ${escapeHtml(user.email)}
📱 <b>Phone:</b> ${escapeHtml(user.phone)}
🆔 <b>Username:</b> ${escapeHtml(user.username)}

🔑 <b>User ID:</b> <code>${escapeHtml(user._id)}</code>

📅 <b>Registered:</b> ${escapeHtml(registeredAt)}

✅ <b>Status:</b> Successfully Registered
`;

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "HTML",
        }),
      }
    );

    const result = await response.json();

    if (!result.ok) {
      console.error("Telegram API error:", result.description);
    }
  } catch (error) {
    console.error("Telegram error:", error.message);
  }
};