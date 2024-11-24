interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

export const sendEmail = async ({ to, subject, html, from = 'no-reply@formationpro.com' }: EmailOptions) => {
  // In development, we'll just log the email details
  console.log('Email would be sent with:', {
    to,
    from,
    subject,
    html,
  });

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Return success
  return { success: true };
};

export const emailTemplates = {
  userInvitation: ({ role, invitedBy, expiresAt }: { role: string; invitedBy: string; expiresAt: Date }) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Invitation à rejoindre FormationPro</h2>
      <p>Bonjour,</p>
      <p>Vous avez été invité(e) à rejoindre FormationPro en tant que ${role}.</p>
      <p>Cette invitation a été envoyée par ${invitedBy} et expire le ${expiresAt.toLocaleDateString()}.</p>
      <p>Pour accepter l'invitation, veuillez cliquer sur le lien ci-dessous :</p>
      <p><a href="#" style="background-color: #FF4400; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Accepter l'invitation</a></p>
      <p>Si vous n'attendiez pas cette invitation, vous pouvez ignorer cet email.</p>
      <p>Cordialement,<br>L'équipe FormationPro</p>
    </div>
  `,

  resetPassword: ({ name, resetLink }: { name: string; resetLink: string }) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Réinitialisation de votre mot de passe</h2>
      <p>Bonjour ${name},</p>
      <p>Nous avons reçu une demande de réinitialisation de votre mot de passe.</p>
      <p>Pour procéder à la réinitialisation, veuillez cliquer sur le lien ci-dessous :</p>
      <p><a href="${resetLink}" style="background-color: #FF4400; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Réinitialiser mon mot de passe</a></p>
      <p>Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email.</p>
      <p>Cordialement,<br>L'équipe FormationPro</p>
    </div>
  `,

  welcomeUser: ({ name }: { name: string }) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Bienvenue sur FormationPro</h2>
      <p>Bonjour ${name},</p>
      <p>Nous sommes ravis de vous accueillir sur FormationPro !</p>
      <p>Votre compte a été créé avec succès. Vous pouvez dès maintenant vous connecter et commencer à utiliser notre plateforme.</p>
      <p>Si vous avez des questions, n'hésitez pas à contacter notre équipe support.</p>
      <p>Cordialement,<br>L'équipe FormationPro</p>
    </div>
  `,
};