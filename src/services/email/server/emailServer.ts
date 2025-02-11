import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import { config } from 'dotenv';

// Load environment variables
config();

const app = express();
app.use(cors());
app.use(express.json());

// Create Gmail transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_APP_PASSWORD // Use App Password, not regular password
  }
});

app.post('/api/email/send', async (req, res) => {
  try {
    const { to, subject, html, text } = req.body;

    await transporter.sendMail({
      from: {
        name: 'CollabSpace',
        address: process.env.GMAIL_EMAIL as string
      },
      to: to.map((recipient: any) => ({
        name: recipient.name,
        address: recipient.email
      })),
      subject,
      html,
      text
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Email sending failed:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to send email'
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Email server running on port ${PORT}`);
});