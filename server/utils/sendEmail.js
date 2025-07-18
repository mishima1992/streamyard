const sendEmail = async (options) => {
  const brevoApiUrl = 'https://api.brevo.com/v3/smtp/email';

  const payload = {
    sender: {
      name: process.env.BREVO_SENDER_NAME,
      email: process.env.BREVO_SENDER_EMAIL,
    },
    to: [
      {
        email: options.email,
      },
    ],
    subject: options.subject,
    htmlContent: options.message,
  };

  try {
    const response = await fetch(brevoApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Brevo API Error: ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log('Email sent successfully via Brevo API. Message ID: %s', data.messageId);
  } catch (error) {
    console.error('Error sending email via Brevo API: ', error);
  }
};

export default sendEmail;
