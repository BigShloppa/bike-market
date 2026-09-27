import nodemailer from 'nodemailer';

const hasSmtp = process.env.SMTP_HOST && process.env.SMTP_USER;

const transporter = hasSmtp
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 2525,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  : null;

export const sendMail = async ({ to, subject, text, html }) => {
  if (!transporter) {
    console.log('[mail skipped — no SMTP config]', { to, subject });
    return;
  }
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@bikemarket.local',
      to,
      subject,
      text,
      html,
    });
    console.log('[mail sent]', info.messageId);
  } catch (err) {
    console.error('[mail error]', err.message);
  }
};

export const sendWelcomeEmail = async (user) => {
  await sendMail({
    to: user.email,
    subject: 'Добро пожаловать в BikeMarket!',
    text: `Привет, ${user.name}!\n\nСпасибо за регистрацию. Теперь вы можете покупать и продавать велосипеды.\n\n— BikeMarket`,
    html: `
      <div style="font-family:sans-serif;max-width:480px">
        <h2>Привет, ${user.name}!</h2>
        <p>Спасибо за регистрацию в <b>BikeMarket</b>.</p>
        <p>Теперь вы можете покупать и продавать велосипеды.</p>
        <hr/>
        <p style="color:#888;font-size:13px">— BikeMarket</p>
      </div>
    `,
  });
};

export const sendNewMessageEmail = async ({ to, fromName, bikeTitle, text }) => {
  await sendMail({
    to,
    subject: `Новое сообщение от ${fromName}`,
    text: `${fromName} пишет по объявлению "${bikeTitle}":\n\n${text}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px">
        <p><b>${fromName}</b> пишет по объявлению <b>"${bikeTitle}"</b>:</p>
        <blockquote style="border-left:3px solid #ccc;padding-left:12px;color:#444">
          ${text}
        </blockquote>
      </div>
    `,
  });
};