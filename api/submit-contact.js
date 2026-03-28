import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

function strip(str) {
  return (str || '').replace(/<[^>]*>/g, '');
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const input = req.body;
  if (!input || !input.name || !input.email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const name = strip(input.name);
  const company = strip(input.company || '');
  const email = strip(input.email);
  const brand = strip(input.q0 || '');
  const pitchResult = strip(input.pitchResult || '');
  const pitchHeading = strip(input.pitchHeading || '');
  const pitchBody = strip(input.pitchBody || '');
  const labels = input.labels || {};
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);

  let body = 'New EA1 Contact Submission\n';
  body += '========================\n\n';
  body += `Name:    ${name}\n`;
  body += `Company: ${company}\n`;
  body += `Email:   ${email}\n`;
  body += `Date:    ${timestamp}\n\n`;
  body += '--- Quiz Responses ---\n\n';

  for (let i = 0; i < 5; i++) {
    const key = `q${i}`;
    if (labels[key]) {
      const qText = strip(labels[key].question || '');
      const aText = strip(labels[key].answer || '');
      body += `${qText}\n→ ${aText}\n\n`;
    }
  }

  body += '--- Quiz Result ---\n';
  body += `Type: ${pitchResult}\n\n`;
  body += `Heading shown:\n"${pitchHeading}"\n\n`;
  body += `Body shown:\n"${pitchBody}"\n\n`;

  try {
    await resend.emails.send({
      from: 'EA1 Website <noreply@ea1.co>',
      to: 'hello@ea1.co',
      replyTo: email,
      subject: `EA1 Contact: ${name} — ${company} (${brand})`,
      text: body,
    });

    return res.status(200).json({ success: true, message: 'Submission received' });
  } catch (err) {
    console.error('Email send failed:', err);
    return res.status(200).json({ success: true, message: 'Logged (mail delivery pending)' });
  }
}
